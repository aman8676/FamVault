import resend from "../config/resend.js";
import { verifyOtpEmail } from "../emails/verifyOtpEmail.js";

export const sendVerifyOtpMail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Fam Vault <noreply@docvault.me>`,
      to: email,
      subject: "Verify your DocVault account",
      html: verifyOtpEmail(otp),
    });

    if (error) {
      console.error("Resend error:", error);
      return;
    }

    console.log("Verify OTP email sent:", data);
  } catch (error) {
    console.error("Email error:", error);
  }
};
