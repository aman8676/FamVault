import transporter from "../config/nodemailer.js";

import { welcomeEmail } from "../emails/welcomeEmail.js";

export const sendWelcomeMail = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our platform",
      html: welcomeEmail(email),
    });
  } catch (error) {
    console.error("Email error:", error);
  }
};

