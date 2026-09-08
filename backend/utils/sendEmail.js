const nodemailer = require('nodemailer');

/**
 * Sends a real verification email via Gmail SMTP or custom SMTP server
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.otp - 6-digit verification code
 * @param {string} [options.name] - Recipient name
 */
async function sendOtpEmail({ to, otp, name }) {
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!gmailUser || !gmailPass) {
    console.warn('\n⚠️ [GRIHO EMAIL WARNING]: GMAIL_USER or GMAIL_APP_PASSWORD is not set in .env.');
    console.warn(`Attempted to send verification code [ ${otp} ] to: ${to}`);
    console.warn('To send real emails to inboxes, please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file.\n');
    return {
      sent: false,
      reason: 'SMTP_NOT_CONFIGURED',
      message: 'Email credentials not configured in server .env',
    };
  }

  // Create real Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailPass.replace(/\s+/g, ''), // Strip spaces from Google 16-char app passwords
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GRIHO Verification Code</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060911; margin: 0; padding: 20px; color: #f1f5f9; }
          .container { max-width: 520px; margin: 0 auto; background: #0b1329; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
          .header { background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 30px 24px; text-align: center; border-bottom: 1px solid rgba(16,185,129,0.3); }
          .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; }
          .badge { display: inline-block; background: #10b981; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px; margin-top: 6px; text-transform: uppercase; }
          .content { padding: 32px 28px; text-align: center; color: #cbd5e1; }
          .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
          .description { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .otp-box { display: inline-block; background: #022c22; border: 2px dashed #10b981; border-radius: 14px; padding: 16px 32px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #34d399; font-family: monospace; margin: 10px 0 24px 0; }
          .expiry-note { font-size: 12px; color: #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 8px 16px; border-radius: 8px; display: inline-block; margin-bottom: 20px; }
          .footer { background: #050811; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.08); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">GRIHO • গৃহ</div>
            <div class="badge">Bangladesh Rental Network</div>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name ? name : 'there'},</div>
            <div class="description">
              Thank you for registering with GRIHO Bangladesh. Use the 6-digit verification code below to verify your email address and activate your account.
            </div>
            <div>
              <div class="otp-box">${otp}</div>
            </div>
            <div>
              <span class="expiry-note">⏳ This code expires in 10 minutes</span>
            </div>
            <div class="description" style="font-size: 12px; margin-top: 10px;">
              If you didn't request this verification code, please disregard this email. Never share this code with anyone.
            </div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} GRIHO Bangladesh Ltd. All rights reserved.<br>
            Dhaka • Chittagong • Sylhet • Rajshahi
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"GRIHO Bangladesh" <${gmailUser}>`,
      to: to,
      subject: `${otp} is your GRIHO verification code`,
      text: `Your GRIHO verification code is: ${otp}. This code is valid for 10 minutes.`,
      html: htmlContent,
    });

    console.log(`\n======================================================`);
    console.log(`✅ [GRIHO EMAIL SENT VIA GMAIL SMTP]`);
    console.log(`To: ${to}`);
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Status: Successfully delivered to recipient SMTP`);
    console.log(`======================================================\n`);

    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [GRIHO SMTP ERROR] Failed to send email:', error);
    return { sent: false, error: error.message };
  }
}

module.exports = { sendOtpEmail };
