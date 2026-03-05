export const FamilyInfoUpdateEmail = (memberName, familyName, adminName, changes) => {
  // Build the changes list HTML
  const changesList = [];
  
  if (changes.name) {
    changesList.push(`<li><strong>Family Name:</strong> Changed to "${changes.name}"</li>`);
  }
  if (changes.description !== undefined) {
    changesList.push(`<li><strong>Description:</strong> ${changes.description ? `Updated to "${changes.description}"` : "Removed"}</li>`);
  }
  if (changes.avatar) {
    changesList.push(`<li><strong>Family Avatar:</strong> Updated with a new image</li>`);
  }

  const changesHtml = changesList.length > 0 
    ? `<ul style="font-size:13px; line-height:1.8; color:#555555; margin:0 0 20px; padding-left:20px;">${changesList.join('')}</ul>`
    : '<p style="font-size:13px; color:#555555;">No specific changes to display.</p>';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Family Info Updated</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:30px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                    <h2 style="margin:0;">Family Info Updated</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <p style="font-size:15px; margin:0 0 12px;">
                      Hi ${memberName},
                    </p>

                    <p style="font-size:14px; line-height:1.6; margin:0 0 20px;">
                      <strong>${adminName}</strong> has updated the information for <strong>${familyName}</strong> family.
                    </p>

                    <!-- Changes Box -->
                    <div style="background:#f8f9ff; border-left:4px solid #4f46e5; padding:20px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0 0 12px; font-size:14px; color:#4f46e5;"><strong>What's Changed:</strong></p>
                      ${changesHtml}
                    </div>

                    <!-- Info Box -->
                    <div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:15px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0; font-size:13px; color:#2e7d32;">
                        <strong>Note:</strong> Log in to Fam Vault to see the updated family information.
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
                    You're receiving this because you're a member of ${familyName}.<br/>
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
