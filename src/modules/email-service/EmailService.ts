import * as nodemailer from 'nodemailer';
import { FRONTEND_URI } from '../../shared/constants';


export async function sendEmail(email: string, password: string ,name:string) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.HOSTEMAIL!,
            pass: process.env.HOSTSECRET! 
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'ระบบออนไลน์สำหรับสหกิจศึกษา สจล. <sender-email@example.com>', // sender address
        to: email, // list of receivers
        subject: 'แจ้งเรื่องการเพิ่มบัญชีผู้ใช้ของท่านเข้าสู่ระบบ', // Subject line
        text: 'แจ้งเรื่องการเพิ่มบัญชีผู้ใช้ในระบบ', // plain text body
        html: `<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset='utf-8'>
                    <title>Email Verification</title>
                  </head>
                  <body>
                    <h5>Email Verification</h5>
                    <p>Dear ${name},</p>
                    <p>Thank you for signing up with our service. To complete your registration, please click on the following link:</p>
                    <p>You can use this password below password for signin our website</p>
                    <h5> ${password} <h5>
                    <p><a href=${FRONTEND_URI}>Verify Your Email Addre Here</a></p>
                    <p>If you did not sign up for our service, please ignore this email.</p>
                    
                  </body>
                </html>
`, // html body
    });

    console.log('Message sent: %s', info.messageId);
}

