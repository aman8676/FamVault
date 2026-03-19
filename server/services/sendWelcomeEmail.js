import resend from "../config/resend.js";
import { welcomeEmail } from "../emails/welcomeEmail.js";

export const sendWelcomeMail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Fam Vault <noreply@docvault.me>`,
      to: email,
      subject: "Welcome to our platform",
      html: welcomeEmail(email),
    });

    if (error) {
      console.error("Resend error:", error);
      return;
    }

    console.log("Welcome email sent:", data);
  } catch (error) {
    console.error("Email error:", error);
  }
};
