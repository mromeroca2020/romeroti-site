# app.py — RomanoTI Tools API (Render)
# -----------------------------------
from fastapi import FastAPI, HTTPException, Depends, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import os, json, platform, socket, subprocess, concurrent.futures

# ===== Config =====
JWT_SECRET = os.getenv("ROMANOTI_JWT_SECRET", "change-me")
JWT_ALG    = os.getenv("ROMANOTI_JWT_ALG", "HS256")
JWT_HOURS  = int(os.getenv("ROMANOTI_JWT_HOURS", "8"))

# CORS
ALLOWED_ORIGINS = os.getenv(
    "ROMANOTI_ALLOWED_ORIGINS",
    "https://romanoti-solutions.netlify.app"
).split(",")

# Control Plane
ORG_API_KEY = os.getenv("ORG_API_KEY", "MySecret123$")  # << pon tu clave en Render

# Users (puedes sustituir por un archivo JSON si lo deseas)
PWD = os.path.dirname(__file__)
USERS_FILE = os.path.join(PWD, "users.json")

DEFAULT_USERS = {
    "eng1": {
        # password: "eng1pass"
        "password": "$2b$12$5c0m0ssUQW0q2wQyN7zhFu8vE7pY8y2J3I/2fH3K1qI4p9p7i9/5y",
        "role": "engineer",
    }
}
if os.path.exists(USERS_FILE):
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as fh:
            USERS = json.load(fh)
    except Exception:
        USERS = DEFAULT_USERS
else:
    USERS = DEFAULT_USERS

# ===== App =====
app = FastAPI(title="RomanoTI Tools API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Auth (JWT) =====
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return False

def create_access_token(data: dict, expires_hours: int = JWT_HOURS) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=expires_hours)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALG)

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class User(BaseModel):
    username: str
    role: str = "engineer"

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    cred_exc = HTTPException(status_code=401, detail="invalid credentials")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        sub = payload.get("sub")
        role = payload.get("role", "engineer")
        if not sub:
            raise cred_exc
        return User(username=sub, role=role)
    except JWTError:
        raise cred_exc

@app.post("/auth/token", response_model=TokenOut)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    u = USERS.get(form.username)
    if not u or not verify_password(form.password, u["password"]):
        raise HTTPException(status_code=401, detail="invalid username or password")
    token = create_access_token({"sub": form.username, "role": u.get("role","engineer")})
    return {"access_token": token, "token_type": "bearer"}

# ===== Health =====
@app.get("/health")
def health():
    return {"status": "ok"}

# ===== Herramientas (protegidas) =====
@app.get("/system/info")
def system_info(user: User = Depends(get_current_user)):
    info = {
        "os": f"{platform.system()} {platform.release()}",
        "version": platform.version(),
        "arch": platform.machine() or platform.processor(),
        "cpu_cores": os.cpu_count(),
        "hostname": socket.gethostname(),
        "ts": datetime.utcnow().isoformat(),
    }
    # RAM (best-effort, sin psutil)
    try:
        if platform.system().lower() == "linux":
            with open("/proc/meminfo","r") as fh:
                first = fh.readline()
                parts = first.split()
                # MemTotal: N kB -> GB
                kb = int(parts[1])
                info["ram_gb"] = round(kb/1024/1024, 1)
    except Exception:
        pass
    return info

@app.get("/network/info")
def network_info(user: User = Depends(get_current_user)):
    host = socket.gethostname()
    addrs = []
    try:
        name, aliases, ips = socket.gethostbyname_ex(host)
        addrs = ips
    except Exception:
        pass
    return {"hostname": host, "ips": addrs, "ts": datetime.utcnow().isoformat()}

class PingIn(BaseModel):
    host: str
    count: Optional[int] = 4

@app.post("/network/ping")
def ping(in_: PingIn, user: User = Depends(get_current_user)):
    host = in_.host.strip()
    count = max(1, min(in_.count or 4, 10))
    if platform.system().lower().startswith("win"):
        cmd = ["ping", "-n", str(count), host]
    else:
        cmd = ["ping", "-c", str(count), host]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        if out.returncode != 0:
            return {"ok": False, "output": out.stdout or out.stderr}
        return {"ok": True, "output": out.stdout}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="ping command not available")
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="ping timeout")

class TraceIn(BaseModel):
    host: str

@app.post("/network/traceroute")
def traceroute(in_: TraceIn, user: User = Depends(get_current_user)):
    host = in_.host.strip()
    if platform.system().lower().startswith("win"):
        cmd = ["tracert", host]
    else:
        # algunos contenedores solo tienen "traceroute" si está instalado
        cmd = ["traceroute", host]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if out.returncode != 0:
            return {"ok": False, "output": out.stdout or out.stderr}
        return {"ok": True, "output": out.stdout}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="traceroute command not available")
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="traceroute timeout")

class PortScanIn(BaseModel):
    host: str
    start: Optional[int] = 1
    end: Optional[int] = 1024
    ports: Optional[List[int]] = None
    timeout_ms: Optional[int] = 400

def _check_port(host: str, port: int, timeout: float) -> Optional[int]:
    try:
        s = socket.socket()
        s.settimeout(timeout)
        res = s.connect_ex((host, port))
        s.close()
        return port if res == 0 else None
    except Exception:
        return None

@app.post("/network/portscan")
def portscan(in_: PortScanIn, user: User = Depends(get_current_user)):
    target = in_.host.strip()
    timeout = max(0.05, float(in_.timeout_ms or 400) / 1000.0)
    if in_.ports:
        ports = sorted(set([p for p in in_.ports if 1 <= int(p) <= 65535]))
    else:
        a = max(1, int(in_.start or 1))
        b = min(65535, int(in_.end or 1024))
        if a > b:
            a, b = b, a
        ports = list(range(a, b + 1))

    open_ports: List[int] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=200) as ex:
        futs = [ex.submit(_check_port, target, p, timeout) for p in ports]
        for f in concurrent.futures.as_completed(futs):
            r = f.result()
            if r:
                open_ports.append(r)
    return {"host": target, "open_ports": sorted(open_ports)}

# ===== Control Plane: reportes de agente LAN =====
REPORTS: List[Dict[str, Any]] = []

def _check_key(x_api_key: Optional[str]):
    if x_api_key != ORG_API_KEY:
        raise HTTPException(status_code=401, detail="invalid api key")

@app.post("/client/report")
async def client_report(req: Request, x_api_key: Optional[str] = Header(None)):
    _check_key(x_api_key)
    try:
        data = await req.json()
    except Exception:
        raise HTTPException(status_code=400, detail="invalid json")

    record = {
        "ts": datetime.utcnow().isoformat() + "Z",
        "agent": data.get("agent") or data.get("client", {}).get("hostname"),
        "payload": data,
    }
    REPORTS.append(record)
    # limit
    if len(REPORTS) > 200:
        del REPORTS[:-200]
    return {"ok": True, "stored": True, "count": len(REPORTS)}

@app.get("/client/reports/latest")
def latest_report(x_api_key: Optional[str] = Header(None)):
    _check_key(x_api_key)
    if not REPORTS:
        raise HTTPException(status_code=404, detail="no reports yet")
    return REPORTS[-1]

