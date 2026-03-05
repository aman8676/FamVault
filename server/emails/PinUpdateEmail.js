export const PinUpdateEmail = (memberName, familyName, adminName, newPin) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Family PIN Updated</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:30px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                    <h2 style="margin:0;">Family PIN Updated</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <p style="font-size:15px; margin:0 0 12px;">
                      Hi ${memberName},
                    </p>

                    <p style="font-size:14px; line-height:1.6; margin:0 0 20px;">
                      The family PIN for <strong>${familyName}</strong> has been updated by <strong>${adminName}</strong>.
                    </p>

                    <!-- New PIN Box -->
                    <div style="background:#fff3e0; border-left:4px solid #ff9800; padding:20px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0 0 8px; font-size:14px; color:#e65100;"><strong>Your New Family PIN:</strong></p>
                      <p style="margin:0; font-size:24px; font-weight:bold; color:#e65100; letter-spacing:4px;">${newPin}</p>
                      <p style="margin:10px 0 0; font-size:12px; color:#666666;">Keep this PIN safe. You'll need it to access family content.</p>
                    </div>

                    <!-- Info Box -->
                    <div style="background:#e3f2fd; border-left:4px solid #2196f3; padding:15px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0; font-size:13px; color:#1565c0;">
                        <strong>Important:</strong> The old PIN will no longer work. Please use this new PIN to access your family vault.
                      </p>
                    </div>

                    <p style="font-size:13px; color:#666666; margin-top:25px;">
                      Thanks,<br />
                      <strong>The Fam Vault Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f1f5f9; padding:12px; text-align:center; font-size:11px; color:#777777;">
                    If you didn't expect this email, please contact your family admin.<br/>
                    &copy; ${new Date().getFullYear()} Fam Vault. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
