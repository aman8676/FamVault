import transporter from "../config/nodemailer.js";
import { InvitationEmail } from "../emails/InvitationEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const sendInvitationEmail=async(admin,name,email,inviterName,pin)=>{
    try{
      const info = await transporter.sendMail({
        from: `"${inviterName} via Fam Vault" <${process.env.SENDER_EMAIL}>`,
        replyTo: admin,
        to:email,
        subject:`${inviterName} invited you to join ${name} family`,
        html:InvitationEmail(email,name,inviterName,pin)// here name if for family.name 
      })

      console.log(info);
    } 
    catch(error){
        console.error("Error sending invitation email:", error);
    }
}