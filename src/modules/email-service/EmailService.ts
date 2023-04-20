import * as nodemailer from 'nodemailer';
import { FRONTEND_URI } from '../../shared/constants';


export async function sendEmail(email: string, password: string ,name:string) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'aphisit.thu@gmail.com', // generated ethereal user
            pass: 'tqbwrjnlxcixycez', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Sender Name <sender-email@example.com>', // sender address
        to: email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset='utf-8'>
                    <title>Email Verification</title>
                  </head>
                  <body>
                    <h1>Email Verification</h1>
                    <p>Dear ${name},</p>
                    <p>Thank you for signing up with our service. To complete your registration, please click on the following link:</p>
                    <h2>You can use this password ${password} for signin our website</h2>     
                    <p><a href=${FRONTEND_URI}>Verify Your Email Address</a></p>
                    <p>If you did not sign up for our service, please ignore this email.</p>
                    
                  </body>
                </html>
`, // html body
    });

    console.log('Message sent: %s', info.messageId);
}

