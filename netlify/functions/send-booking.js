const nodemailer = require("nodemailer");

exports.handler = async (event) => {

const data = JSON.parse(event.body);

const transporter = nodemailer.createTransport({
host: "mail.privateemail.com",
port: 587,
secure: false,
auth: {
user: "info@romanoti-solutions.com",
pass: process.env.EMAIL_PASS
}
});

const message = `
New Consultation Request

Name: ${data.fullname}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Service: ${data.service}
Date: ${data.date}
Time: ${data.time}

Issue:
${data.issue}
`;

await transporter.sendMail({
from: '"Romanoti Booking" <info@romanoti-solutions.com>',
to: "info@romanoti-solutions.com",
subject: "New Consultation Request",
text: message
});

return {
statusCode: 200,
body: JSON.stringify({status:"sent"})
};
};
