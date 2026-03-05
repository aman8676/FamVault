export const welcomeEmail =(email)=>{
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome Email</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                  <h1 style="margin:0; font-size:24px;">Welcome to Our Platform 🚀</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  <p style="font-size:16px; margin:0 0 15px;">
                    Hi <strong>${email}</strong>,
                  </p>

                  <p style="font-size:15px; line-height:1.6; margin:0 0 20px;">
                    We’re excited to have you on board! Your account has been successfully created and you can now start exploring all the features we offer.
                  </p>

                  <p style="font-size:15px; line-height:1.6; margin:0 0 25px;">
                    If you ever need help, feel free to reach out to our support team — we’re always here for you.
                  </p>

                  <!-- Button -->
                  <div style="text-align:center; margin-bottom:30px;">
                    <a href="#" 
                      style="background:#4f46e5; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:15px; display:inline-block;">
                      Get Started
                    </a>
                  </div>

                  <p style="font-size:14px; color:#666666; margin:0;">
                    Cheers,<br />
                    <strong>The Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#777777;">
                  © ${new Date().getFullYear()} Your Company. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
    `
}