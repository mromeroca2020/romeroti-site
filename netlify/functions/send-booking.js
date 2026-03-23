const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // EMAIL INTERNO
    await transporter.sendMail({
      from: `"Romanoti Website" <${process.env.EMAIL_USER}>`,
      to: "info@romanoti-solutions.com",
      subject: "🚀 New Booking Request",
      html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
    });

    // EMAIL CLIENTE
    await transporter.sendMail({
      from: `"Romanoti Solutions" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "We received your request",
      html: `<h2>Thank you ${data.fullname}</h2><p>We will contact you soon.</p>`,
    });

    return {
      statusCode: 200,
      body: "Emails sent",
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
