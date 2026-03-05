export const FamilyDeletedEmail = (memberName, familyName, adminName) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Family Deleted</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:30px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:#dc2626; padding:20px; text-align:center; color:#ffffff;">
                    <h2 style="margin:0;">Family Has Been Deleted</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <p style="font-size:15px; margin:0 0 12px;">
                      Hi ${memberName},
                    </p>

                    <p style="font-size:14px; line-height:1.6; margin:0 0 20px;">
                      We're writing to inform you that the <strong>${familyName}</strong> family has been deleted by <strong>${adminName}</strong>.
                    </p>

                    <!-- Info Box -->
                    <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:20px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0 0 8px; font-size:14px; color:#991b1b;"><strong>What this means:</strong></p>
                      <ul style="font-size:13px; line-height:1.8; color:#555555; margin:0; padding-left:20px;">
                        <li>You no longer have access to this family vault</li>
                        <li>All shared photos, documents, and files have been removed</li>
                        <li>The family PIN is no longer valid</li>
                      </ul>
                    </div>

                    <!-- Reassurance Box -->
                    <div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:15px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0; font-size:13px; color:#2e7d32;">
                        <strong>Don't worry!</strong> Your personal Fam Vault account is still active. You can create a new family or join another one anytime.
                      </p>
                    </div>

                    <p style="font-size:13px; color:#666666; margin-top:25px;">
                      Thanks for being part of ${familyName}.<br /><br />
                      Best regards,<br />
                      <strong>The Fam Vault Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f1f5f9; padding:12px; text-align:center; font-size:11px; color:#777777;">
                    If you have any questions, please contact our support team.<br/>
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
