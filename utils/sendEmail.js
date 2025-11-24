// import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,  // Brevo SMTP Login
        pass: process.env.SMTP_PASS,  // Brevo SMTP Key
      },
    });

    const mailOptions = {
      from: `"FitFactory 🚀" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.6">
            <h2>FitFactory Verification Code</h2>
            <p>${message}</p>
            <p style="color:gray;font-size:12px;">This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✔ Email sent successfully!");
    return true;

  } catch (error) {
    console.error("❌ Email sending error:", error);
    return false;
  }
};

export default sendEmail;