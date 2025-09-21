
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

const sendOtpEmail = async ({ email, fullname, otp }) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Password Reset OTP`,
    html: `
      <div style="font-family: Arial; padding: 20px; border: 1px solid #ccc;">
        <h2>Password Reset OTP</h2>
        <p>Hello ${fullname || 'User'},</p>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>Expires in 15 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendStatusUpdateEmail = async ({ email, subject, status }) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Your Ticket Status Has Been Updated`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">Ticket Status Update</h2>
        <p>Your ticket with subject "<strong>${subject}</strong>" is now <strong>${status}</strong>.</p>
        <p>If you have any further queries, feel free to reply to this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail,sendStatusUpdateEmail };
