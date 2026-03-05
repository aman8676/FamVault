import transporter from "../config/nodemailer.js";
import { FamilyInfoUpdateEmail } from "../emails/FamilyInfoUpdateEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const sendFamilyInfoUpdateEmail = async (memberEmail, memberName, familyName, adminName, changes) => {
  try {
    const info = await transporter.sendMail({
      from: `"Fam Vault" <${process.env.SENDER_EMAIL}>`,
      to: memberEmail,
      subject: `${familyName} family info has been updated`,
      html: FamilyInfoUpdateEmail(memberName, familyName, adminName, changes),
    });

    console.log(`Family info update email sent to ${memberEmail}:`, info.messageId);
    return { success: true, email: memberEmail };
  } catch (error) {
    console.error(`Error sending family info update email to ${memberEmail}:`, error);
    return { success: false, email: memberEmail, error: error.message };
  }
};

export const sendFamilyInfoUpdateToAllMembers = async (members, familyName, adminName, changes) => {
  const results = await Promise.allSettled(
    members.map((member) =>
      sendFamilyInfoUpdateEmail(member.user.email, member.user.name, familyName, adminName, changes)
    )
  );

  const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const failed = results.filter((r) => r.status === "rejected" || !r.value?.success).length;

  console.log(`Family info update emails sent: ${successful} successful, ${failed} failed`);

  return { successful, failed, total: members.length };
};
