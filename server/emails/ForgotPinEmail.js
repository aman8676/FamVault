export const FamilyPinResetEmail = (familyName, adminName, resetDate, pin, loginUrl) => {
  const pinBoxes = pin
    .toString()
    .split('')
    .map(
      digit =>
        `<td style="width:48px;height:56px;background:rgba(255,255,255,0.08);border:1px solid rgba(99,102,241,0.4);border-radius:10px;text-align:center;vertical-align:middle;font-size:24px;font-weight:800;color:#ffffff;padding:0 8px;">${digit}</td>
         <td style="width:8px;"></td>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Family PIN Reset</title>
      </head>
      <body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 16px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:24px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);">

                <!-- Top accent bar -->
                <tr>
                  <td style="background:linear-gradient(90deg,#6366f1,#8b5cf6,#6366f1);height:4px;"></td>
                </tr>

                <!-- Header -->
                <tr>
                  <td align="center" style="padding:40px 40px 28px;">
                    <div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2));border:1px solid rgba(99,102,241,0.3);display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;">
                      <table cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" style="width:64px;height:64px;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="#818cf8"/>
                        </svg>
                      </td></tr></table>
                    </div>
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.18em;color:#6366f1;text-transform:uppercase;">FamilyVault</p>
                    <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">Family PIN Has Been Reset</h1>
                    <p style="margin:10px 0 0;font-size:14px;color:#94a3b8;line-height:1.6;">
                      The access PIN for your family vault has been changed by the admin.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
                  </td>
                </tr>

                <!-- Family Info -->
                <tr>
                  <td style="padding:28px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:14px;border:1px solid rgba(255,255,255,0.07);">
                      <tr>
                        <td style="padding:20px 22px;">

                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                            <tr><td style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.12em;">Family Name</td></tr>
                            <tr><td style="font-size:16px;font-weight:700;color:#e2e8f0;padding-top:4px;">${familyName}</td></tr>
                          </table>

                          <div style="height:1px;background:rgba(255,255,255,0.05);margin-bottom:14px;"></div>

                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                            <tr><td style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.12em;">Reset By</td></tr>
                            <tr><td style="font-size:15px;font-weight:600;color:#e2e8f0;padding-top:4px;">${adminName}</td></tr>
                          </table>

                          <div style="height:1px;background:rgba(255,255,255,0.05);margin-bottom:14px;"></div>

                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr><td style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.12em;">Reset On</td></tr>
                            <tr><td style="font-size:14px;font-weight:500;color:#94a3b8;padding-top:4px;">${resetDate}</td></tr>
                          </table>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- New PIN Box -->
                <tr>
                  <td style="padding:0 40px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12));border-radius:14px;border:1px solid rgba(99,102,241,0.25);">
                      <tr>
                        <td align="center" style="padding:24px 20px;">
                          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:0.15em;">Your New PIN</p>
                          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                            <tr>${pinBoxes}</tr>
                          </table>
                          <p style="margin:14px 0 0;font-size:12px;color:#64748b;">Use this PIN to access your family vault</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Warning Box -->
                <tr>
                  <td style="padding:0 40px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(245,158,11,0.08);border-radius:12px;border:1px solid rgba(245,158,11,0.2);">
                      <tr>
                        <td style="padding:16px 18px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td valign="top" style="padding-right:12px;font-size:16px;">⚠️</td>
                              <td>
                                <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#fbbf24;">Security Notice</p>
                                <p style="margin:0;font-size:12px;color:#d97706;line-height:1.6;">
                                  If you did not expect this change, please contact your family admin — <strong style="color:#fbbf24;">${adminName}</strong> — immediately.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding:0 40px 36px;">
                    <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:12px;letter-spacing:0.03em;">
                      Open FamilyVault →
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding:24px 40px 32px;">
                    <p style="margin:0 0 6px;font-size:12px;color:#475569;">
                      You received this email because you are a member of <strong style="color:#6366f1;">${familyName}</strong> on FamilyVault.
                    </p>
                    <p style="margin:0;font-size:11px;color:#334155;">
                      © ${new Date().getFullYear()} FamilyVault · Secure Family Document Sharing
                    </p>
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