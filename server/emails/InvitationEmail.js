export const InvitationEmail = (email, familyName, inviterName, familyPin) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Family Invitation</title>
      </head>

      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:30px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                    <h2 style="margin:0;">You're Invited!</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <p style="font-size:15px; margin:0 0 12px;">
                      Hi there,
                    </p>

                    <p style="font-size:14px; line-height:1.6; margin:0 0 20px;">
                      Great news! <strong>${inviterName}</strong> has invited you to join the <strong>${familyName}</strong> family on Fam Vault.
                    </p>

                    <!-- Invitation Box -->
                    <div style="background:#f8f9ff; border-left:4px solid #4f46e5; padding:20px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0 0 8px; font-size:14px;"><strong>Invited by:</strong> ${inviterName}</p>
                      <p style="margin:0 0 8px; font-size:14px;"><strong>Family Name:</strong> ${familyName}</p>
                      <p style="margin:0; font-size:14px;"><strong>Your Email:</strong> ${email}</p>
                    </div>

                    <!-- Family PIN Box -->
                    <div style="background:#fff3e0; border-left:4px solid #ff9800; padding:20px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0 0 8px; font-size:14px; color:#e65100;"><strong>Your Family PIN:</strong></p>
                      <p style="margin:0; font-size:24px; font-weight:bold; color:#e65100; letter-spacing:4px;">${familyPin}</p>
                      <p style="margin:10px 0 0; font-size:12px; color:#666666;">Keep this PIN safe. You'll need it to access family content.</p>
                    </div>

                    <p style="font-size:14px; line-height:1.6; margin:20px 0;">
                      <strong>What you can do as a family member:</strong>
                    </p>

                    <ul style="font-size:13px; line-height:1.8; color:#555555; margin:0 0 20px; padding-left:20px;">
                      <li>Share photos, videos, and precious family moments</li>
                      <li>Stay connected with family chat and updates</li>
                      <li>Access shared documents and important files</li>
                      <li>Keep everything secure and private within your family</li>
                    </ul>

                    <div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:15px; margin:20px 0; border-radius:4px;">
                      <p style="margin:0; font-size:13px; color:#2e7d32;">
                        <strong>Next Steps:</strong> 
                        <ul style="margin:8px 0 0; padding-left:16px;">
                          <li>If you have a Fam Vault account: Log in to accept this invitation</li>
                          <li>If you're new: Create a free account at <a href="${process.env.CLIENT_URL || 'https://docvault.me'}">docvault.me</a> to join</li>
                        </ul>
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
                    If you didn't expect this invitation, you can safely ignore this email.<br/>
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
