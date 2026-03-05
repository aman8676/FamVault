export const ResetOtpEmail = (email,otp)=>{
    return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset OTP</title>
  </head>

  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                <h2 style="margin:0;">Reset Your Password 🔐</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333;">
                <p style="font-size:15px; margin:0 0 12px;">
                  Hi <strong>${email}</strong>,
                </p>

                <p style="font-size:14px; line-height:1.6; margin:0 0 20px;">
                  We received a request to reset your password. Use the OTP below to continue:
                </p>

                <!-- OTP Box -->
                <div style="text-align:center; margin:20px 0;">
                  <span style="font-size:24px; letter-spacing:6px; font-weight:bold; color:#4f46e5;">
                    ${otp}
                  </span>
                </div>

                <p style="font-size:13px; color:#555555; line-height:1.6;">
                  This OTP is valid for <strong>10 minutes</strong>.  
                  If you didn’t request this, please ignore this email.
                </p>

                <p style="font-size:13px; color:#666666; margin-top:25px;">
                  Thanks,<br />
                  <strong>The Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f5f9; padding:12px; text-align:center; font-size:11px; color:#777777;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;
}