export const verifyOtpEmail = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Verify Your Email</h2>
      <p>Thank you for registering! Use the OTP below to verify your email:</p>
      
      <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #4F46E5; letter-spacing: 8px; font-size: 36px;">${otp}</h1>
      </div>

      <p style="color: #6b7280;">This OTP is valid for <strong>24 hours</strong>.</p>
      <p style="color: #6b7280;">If you didn't create an account, ignore this email.</p>
    </div>
  `;
};
