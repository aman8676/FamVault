import transporter from "../config/nodemailer.js";
import { verifyOtpEmail } from "../emails/verifyOtpEmail.js";

export const sendVerifyOtpMail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your DocVault account",
      html: verifyOtpEmail(otp),
    });
  } catch (error) {
    console.error("Email error:", error);
  }
};
