import transporter from "../config/nodemailer.js";
import { PinUpdateEmail } from "../emails/PinUpdateEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const sendPinUpdateEmail = async (memberEmail, memberName, familyName, adminName, newPin) => {
  try {
    const info = await transporter.sendMail({
      from: `"Fam Vault" <${process.env.SENDER_EMAIL}>`,
      to: memberEmail,
      subject: `Family PIN updated for ${familyName}`,
      html: PinUpdateEmail(memberName, familyName, adminName, newPin),
    });

    console.log(`PIN update email sent to ${memberEmail}:`, info.messageId);
    return { success: true, email: memberEmail };
  } catch (error) {
    console.error(`Error sending PIN update email to ${memberEmail}:`, error);
    return { success: false, email: memberEmail, error: error.message };
  }
};

export const sendPinUpdateToAllMembers = async (members, familyName, adminName, newPin) => {
  const results = await Promise.allSettled(
    members.map((member) =>
      sendPinUpdateEmail(member.user.email, member.user.name, familyName, adminName, newPin)
    )
  );

  const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const failed = results.filter((r) => r.status === "rejected" || !r.value?.success).length;

  console.log(`PIN update emails sent: ${successful} successful, ${failed} failed`);

  return { successful, failed, total: members.length };
};
