import resend from "../config/resend.js";
import { InvitationEmail } from "../emails/InvitationEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const sendInvitationEmail = async (
  admin,
  name,
  email,
  inviterName,
  pin,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Fam Vault <noreply@docvault.me>`,
      reply_to: admin,
      to: email,
      subject: `${inviterName} invited you to join ${name} family`,
      html: InvitationEmail(email, name, inviterName, pin),
    });

    if (error) {
      console.error("Resend error:", error);
      return;
    }

    console.log("Invitation email sent:", data);
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
};
