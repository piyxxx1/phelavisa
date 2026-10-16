import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable Nodemailer transporter using Zoho SMTP credentials
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.zoho.in';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'contact@pehlavisa.com';
  const pass = process.env.SMTP_PASS || 'VWzac7DqiEB0';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send automated payment confirmation email to applicant/user upon successful payment.
 */
export const sendPaymentConfirmationEmail = async ({
  to,
  recipientName = 'Valued Customer',
  serviceTitle = 'Visa / Travel Service Application',
  bookingRefId = 'PV-REF',
  amountPaid = '4999',
  paymentMethod = 'Razorpay Official Gateway',
  transactionId = 'TXN-PAID',
  serviceType = 'Visa Application',
}) => {
  try {
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      console.warn('⚠️ [Email Service] No valid recipient email address provided. Email skipped.');
      return false;
    }

    const transporter = createTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Team PehlaVisa" <contact@pehlavisa.com>';
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    const subject = `Payment Received & Booking Confirmed (Ref: ${bookingRefId}) | PehlaVisa`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Received - PehlaVisa</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #ffffff; padding: 25px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 5px 0 0 0; font-size: 14px; color: #93c5fd; }
        .body { padding: 30px; }
        .badge { background-color: #dcfce7; color: #15803d; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; display: inline-block; margin-bottom: 15px; }
        .message-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
        .message-box p { margin: 0; font-size: 15px; color: #1e40af; font-weight: 600; line-height: 1.5; }
        .table-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px 20px; margin-bottom: 25px; }
        .table-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .table-row:last-child { border-bottom: none; }
        .table-label { color: #64748b; font-weight: 600; }
        .table-value { color: #0f172a; font-weight: 700; text-align: right; }
        .cta-btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; margin-top: 10px; text-align: center; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
        .footer { background-color: #f1f5f9; padding: 20px 30px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈️ PehlaVisa Official</h1>
          <p>Visa Processing & Verified Dummy Ticket Services</p>
        </div>

        <div class="body">
          <span class="badge">✅ PAYMENT SUCCESSFUL</span>
          <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px;">Dear ${recipientName},</h2>

          <div class="message-box">
            <p style="margin: 0; font-size: 15px; color: #1e40af; font-weight: 700;">Your payment has been received.</p>
            <p style="margin: 6px 0 0 0; color: #1e40af;">Our agent will get to you soon.</p>
            <p style="margin: 6px 0 0 0; color: #0369a1; font-weight: 700;">Please check the orders section for latest update.</p>
          </div>

          <div class="table-box">
            <div class="table-row">
              <span class="table-label">Booking Reference ID:</span>
              <span class="table-value">${bookingRefId}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Service Type:</span>
              <span class="table-value">${serviceType}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Details / Destination:</span>
              <span class="table-value">${serviceTitle}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Total Amount Paid:</span>
              <span class="table-value" style="color: #16a34a; font-size: 16px;">₹${Number(amountPaid).toLocaleString('en-IN')}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Payment Gateway:</span>
              <span class="table-value">${paymentMethod}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Transaction ID:</span>
              <span class="table-value" style="font-family: monospace;">${transactionId}</span>
            </div>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="${siteUrl}/#orders" class="cta-btn">View My Orders Section ➔</a>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 5px 0;">Need urgent assistance? Reply to this email or contact support at <strong>contact@pehlavisa.com</strong>.</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} Team PehlaVisa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`✉️ [Email Service] Payment confirmation email sent to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`❌ [Email Service] Failed to send email to ${to}:`, error.message);
    return false;
  }
};
