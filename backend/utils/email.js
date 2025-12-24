const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to LimeRoad!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Dear ${data.name},</h2>
        <p>Thank you for signing up with <strong>LimeRoad</strong>.</p>
        <p>We’re pleased to inform you that your account has been created successfully. You can now log in and start exploring our services right away.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #84cc16; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Account & Login
          </a>
        </div>

        <p>If you have any questions or need assistance, feel free to reach out to our support team at <strong>support@limeroad.com</strong>.</p>

        <p>We’re glad to have you with us and look forward to serving you.</p>

        <p>Warm regards,<br>
        <strong>The LimeRoad Team</strong><br>
        <a href="${process.env.CLIENT_URL}" style="color: #666;">www.limeroad.com</a><br>
        +91 1234567890</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from LimeRoad. Please do not reply to this email.
        </p>
      </div>
    `,
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
        <p>This link will expire in ${data.expiryTime}.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from Our Store. Please do not reply to this email.
        </p>
      </div>
    `,
  }),
};

// Send email function
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();

    let emailContent;
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
      subject = emailContent.subject;
    }

    const mailOptions = {
      from: `"Our Store" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html: emailContent?.html || data?.html || '',
      text: data?.text || '',
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };