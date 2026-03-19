import resend from "../config/resend.js";
import { FamilyDeletedEmail } from "../emails/FamilyDeletedEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const sendFamilyDeletedEmail = async (
  memberEmail,
  memberName,
  familyName,
  adminName,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Fam Vault <noreply@docvault.me>`,
      to: memberEmail,
      subject: `${familyName} family has been deleted`,
      html: FamilyDeletedEmail(memberName, familyName, adminName),
    });

    if (error) {
      console.error(`Resend error for ${memberEmail}:`, error);
      return { success: false, email: memberEmail, error: error.message };
    }

    console.log(`Family deleted email sent to ${memberEmail}:`, data.id);
    return { success: true, email: memberEmail };
  } catch (error) {
    console.error(
      `Error sending family deleted email to ${memberEmail}:`,
      error,
    );
    return { success: false, email: memberEmail, error: error.message };
  }
};

export const sendFamilyDeletedToAllMembers = async (
  members,
  familyName,
  adminName,
) => {
  const results = await Promise.allSettled(
    members.map((member) =>
      sendFamilyDeletedEmail(
        member.user.email,
        member.user.name,
        familyName,
        adminName,
      ),
    ),
  );

  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value.success,
  ).length;
  const failed = results.filter(
    (r) => r.status === "rejected" || !r.value?.success,
  ).length;

  console.log(
    `Family deleted emails sent: ${successful} successful, ${failed} failed`,
  );

  return { successful, failed, total: members.length };
};


