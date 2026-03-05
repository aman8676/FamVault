import transporter from "../config/nodemailer.js";
import { FamilyDeletedEmail } from "../emails/FamilyDeletedEmail.js";
import dotenv from "dotenv";

dotenv.config();


export const sendFamilyDeletedEmail = async (memberEmail, memberName, familyName, adminName) => {
  try {
    const info = await transporter.sendMail({
      from: `"Fam Vault" <${process.env.SENDER_EMAIL}>`,
      to: memberEmail,
      subject: `${familyName} family has been deleted`,
      html: FamilyDeletedEmail(memberName, familyName, adminName),
    });

    console.log(`Family deleted email sent to ${memberEmail}:`, info.messageId);
    return { success: true, email: memberEmail };
  } catch (error) {
    console.error(`Error sending family deleted email to ${memberEmail}:`, error);
    return { success: false, email: memberEmail, error: error.message };
  }
};

export const sendFamilyDeletedToAllMembers = async (members, familyName, adminName) => {
  const results = await Promise.allSettled(
    members.map((member) =>
      sendFamilyDeletedEmail(member.user.email, member.user.name, familyName, adminName)
    )
  );

  const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const failed = results.filter((r) => r.status === "rejected" || !r.value?.success).length;

  console.log(`Family deleted emails sent: ${successful} successful, ${failed} failed`);

  return { successful, failed, total: members.length };
};
