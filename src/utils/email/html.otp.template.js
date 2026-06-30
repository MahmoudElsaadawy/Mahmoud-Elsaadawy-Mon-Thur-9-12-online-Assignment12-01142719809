// this is written by claude too just like the OAuth html page

export const generateOtpHtml = (name, otp) => {
  const htmlTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
  </head>
  <body style="margin:0;padding:0;background:#f0f2f5;font-family:system-ui,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:#4f46e5;padding:32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Verify Your Account</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 40px 24px;">
                <p style="margin:0 0 8px;font-size:16px;color:#111;">Hi ${name},</p>
                <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
                  Use the code below to verify your account. This code expires in <strong>5 minutes</strong>.
                </p>

                <!-- OTP Box -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:24px;background:#f5f4ff;border-radius:10px;border:1px solid #e0deff;">
                      <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#4f46e5;font-family:monospace;">${otp}</span>
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 0;font-size:13px;color:#999;line-height:1.6;">
                  If you didn't request this, you can safely ignore this email. Do not share this code with anyone.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
                <p style="margin:0;font-size:12px;color:#bbb;">© ${new Date().getFullYear()} Saraha App. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
  return htmlTemplate;
};
