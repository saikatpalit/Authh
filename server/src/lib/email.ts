// import nodemailer from "nodemailer";

// export async function sendEmail(to: string, subject: string, html: string) {
//   if (
//     !process.env.SMTP_HOST ||
//     !process.env.SMTP_USER ||
//     !process.env.SMTP_PASS
//   ) {
//     console.log("Email envs r not available");
//     return;
//   }

//   const host = process.env.SMTP_HOST;
//   const port = Number(process.env.SMTP_PORT || "587");
//   const user = process.env.SMTP_USER;
//   const pass = process.env.SMTP_PASS;
//   const from = process.env.EMAIL_FROM;

//   const transporter = nodemailer.createTransport({
//     host,
//     port,
//     secure: false,
//       requireTLS: true,
//     auth: {
//       user,
//       pass,
//     },
//     connectionTimeout: 10000,
//   });

//   await transporter.sendMail({
//     from,
//     to,
//     subject,
//     html,
//   });
// }


import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — email not sent");
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Auth App <noreply@gloomyweb.com>",
    to,
    subject,
    html,
  });
}