
import nodemailer from 'nodemailer'

const  sendEmail  = async(email,subject,text)=>{
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.USER,
              pass: process.env.GMAIL_PASS,
              clientId: '432979864233-qum4dpfprmk20cbtti5n7un4s6hlfd9m.apps.googleusercontent.com',
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