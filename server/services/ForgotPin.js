import resend from "../config/resend.js";
import { FamilyPinResetEmail } from "../emails/ForgotPinEmail.js";

import dotenv from "dotenv";

dotenv.config();

export const FamilyForgotPin = async (
  familyName,
  adminName,
  resetDate,
  pin,
  loginUrl,
  memberEmail,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Fam Vault <noreply@docvault.me>`,
      to: memberEmail,
      subject: `Your Family PIN for ${familyName} has been reset`,
      html: FamilyPinResetEmail(
        familyName,
        adminName,
        resetDate,
        pin,
        loginUrl,
      ),
    });

    if (error) {
      console.error("Resend error:", error);
      return;
    }

    console.log("Email sent:", data);
  } catch (error) {
    console.error("Error sending PIN reset email:", error);
  }
};
