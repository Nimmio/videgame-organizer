import nodemailer from "nodemailer";
// Create a transporter for SMTP
const getTransporter = () => {
  const config = {
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    secure: process.env.SMTP_SECURE === "true",
  };
  const transporter = nodemailer.createTransport(config);
  return transporter;
};

interface sendMailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({ to, subject, text, html }: sendMailParams) => {
  const transporter = getTransporter();

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: to,
    subject: subject,
    text: text, // plain‑text body
    html: html, // HTML body
  });
};
