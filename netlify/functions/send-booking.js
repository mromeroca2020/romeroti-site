const nodemailer = require("nodemailer");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const { fullname, email, phone, company, message } = data;

    // =========================
    // 📩 EMAIL SETUP
    // =========================
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // =========================
    // 🧠 CRM: BUSCAR O CREAR LEAD
    // =========================
    let { data: lead } = await supabase
      .from("leads")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!lead) {
      const { data: newLead } = await supabase
        .from("leads")
        .insert([
          {
            name: fullname,
            email,
            phone,
            company,
          },
        ])
        .select()
        .single();

      lead = newLead;
    }

    // =========================
    // 📌 CRM: CREAR EVENTO
    // =========================
    await supabase.from("lead_events").insert([
      {
        lead_id: lead.id,
        type: "booking",
        description: message || "New booking request",
      },
    ]);

    // =========================
    // 📥 CRM: GUARDAR EMAIL
    // =========================
    await supabase.from("emails").insert([
      {
        lead_id: lead.id,
        subject: "New Booking Request",
        from_email: email,
        to_email: "info@romanoti-solutions.com",
        body: JSON.stringify(data),
        direction: "inbound",
      },
    ]);

    // =========================
    // 📩 EMAIL INTERNO
    // =========================
    await transporter.sendMail({
      from: `"Romanoti Website" <${process.env.EMAIL_USER}>`,
      to: "info@romanoti-solutions.com",
      subject: "🚀 New Booking Request",
      html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
    });

    // =========================
    // 📩 EMAIL CLIENTE
    // =========================
    await transporter.sendMail({
      from: `"Romanoti Solutions" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your request",
      html: `<h2>Thank you ${fullname}</h2><p>We will contact you soon.</p>`,
    });

    return {
      statusCode: 200,
      body: "Booking + CRM saved + Emails sent",
    };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
