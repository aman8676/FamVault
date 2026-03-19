import resend from "../config/resend.js";
import { ResetOtpEmail } from "../emails/ResetOtpEmail.js";

export const ResetOtpMail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Fam Vault <noreply@docvault.me>`,
      to: email,
      subject: "Reset Otp for your account",
      html: ResetOtpEmail(email, otp),
    });

    if (error) {
      console.error("Resend error:", error);
      return;
    }

    console.log("Email sent:", data);
  } catch (error) {
    console.error("Email error:", error);
  }
};
