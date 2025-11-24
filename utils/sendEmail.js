import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // your gmail
        pass: process.env.EMAIL_PASS,   // your app password
      },
    });

    const mailOptions = {
      from: `"FitFactory 🚀" <${process.env.EMAIL_USER}>`,
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

    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export default sendEmail;