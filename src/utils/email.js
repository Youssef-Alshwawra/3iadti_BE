import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendEmail = async (options) => {
  try {
    // Development mode - skip actual email sending
    if (
      process.env.NODE_ENV === "development" &&
      process.env.SKIP_EMAIL === "true"
    ) {
      console.log("🧪 DEVELOPMENT MODE - Email skipped");
      console.log("📧 Would send email to:", options.to);
      console.log("📧 Subject:", options.subject);
      console.log("📧 Content:", options.html);
      return { messageId: "dev-mode-" + Date.now() };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    console.log("📧 Attempting to send email to:", options.to);
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};
