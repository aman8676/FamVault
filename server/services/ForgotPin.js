import transporter from "../config/nodemailer.js";
import { FamilyPinResetEmail } from "../emails/ForgotPinEmail.js";

import dotenv from "dotenv"

dotenv.config();

export const FamilyForgotPin = async(familyName, adminName, resetDate, pin, loginUrl,memberEmail)=>{
try {
  const info = await transporter.sendMail({
    from: `"${adminName} via Fam Vault" <${process.env.SENDER_EMAIL}>`,
    to: memberEmail,
    subject: `Your Family PIN for ${familyName} has been reset`,
    html: FamilyPinResetEmail(familyName, adminName, resetDate, pin, loginUrl),
  });

  console.log(info);
} catch (error) {
  console.error("Error sending PIN reset email:", error);
}
}

