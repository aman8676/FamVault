import transporter from "../config/nodemailer.js";
import { ResetOtpEmail } from "../emails/ResetOtpEmail.js";

export const ResetOtpMail = async (email,otp) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Otp for your account",
      html: ResetOtpEmail(email,otp),
    });
  } catch (error) {
    console.error("Email error:", error);
  }
};

