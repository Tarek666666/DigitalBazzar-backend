
import nodemailer from 'nodemailer'

const  sendEmail  = async(email,subject,text)=>{
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.USER,
              pass: process.env.GMAIL_PASS,
              clientId: '564195426438-80kkbnm061jb3pq9r0dpjat0eqamkug4.apps.googleusercontent.com',
              clientSecret: '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',
              refreshToken: process.env.GMAIL_RFRESHTOKEN
            }
          });
        let from =  ' "Digital Bazzar Shop" <2b3zab666@gmail.com> '
        await transporter.sendMail({
            from: from,
            to: email,
            subject:subject,
            text:text
        })
        console.log('email successfully sent ')
        
    } catch (error) {
        console.log('email was not sent')
        console.log(error)
    }
}
export {sendEmail}