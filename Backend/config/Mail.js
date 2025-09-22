import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});



// Wrap in an async IIFE so we can use await.

export const sendMail = async (to, otp) => {
    await transporter.sendMail({
    from: `"Aura Support" <${process.env.EMAIL}>`,
    to,
    subject: "Reset your password",
    html:`
      <div style="font-family: Arial, sans-serif; padding:20px; background-color:#f9f9f9;">
        <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px; border:1px solid #ddd;">
          
          <h2 style="text-align:center; color:#4F46E5;">Aura Password Reset</h2>
          
          <p style="font-size:16px; color:#333;">
            You recently requested to reset your password. Use the OTP below to proceed:
          </p>
          
          <div style="text-align:center; margin:20px 0;">
            <span style="font-size:24px; font-weight:bold; color:#111; letter-spacing:3px; border:2px dashed #4F46E5; padding:10px 20px; border-radius:6px; display:inline-block;">
              ${otp}
            </span>
          </div>
          
          <p style="font-size:15px; color:#555;">
            ⚠️ This OTP will expire in <b>5 minutes</b>. Do not share it with anyone for your account security.
          </p>
          
          <p style="font-size:14px; color:#888; margin-top:30px; text-align:center;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
          
        </div>
      </div>
    `,
  });
}
// export default sendMail;




export const sendVerificationMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Aura Verification" <${process.env.EMAIL}>`,
      to,
      subject: "Verify your Aura Account ✅",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px; background-color:#f9f9f9;">
          <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px; border:1px solid #ddd;">
            
            <h2 style="text-align:center; color:#4F46E5;">Verify your Aura Account</h2>
            
            <p style="font-size:16px; color:#333;">
              Welcome to <b>Aura</b>! 🎉  
              To complete your registration, please verify your email using the OTP below:
            </p>
            
            <div style="text-align:center; margin:20px 0;">
              <span style="font-size:24px; font-weight:bold; color:#111; letter-spacing:3px; border:2px dashed #4F46E5; padding:10px 20px; border-radius:6px; display:inline-block;">
                ${otp}
              </span>
            </div>
            
            <p style="font-size:15px; color:#555;">
              ⚠️ This OTP will expire in <b>5 minutes</b>. Do not share it with anyone.
            </p>
            
            <p style="font-size:14px; color:#888; margin-top:30px; text-align:center;">
              Didn’t create an account? You can ignore this email.
            </p>
            
          </div>
        </div>
      `,
    });

    console.log("Verification email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// export default sendVerificationMail;
