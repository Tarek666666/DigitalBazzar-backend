
import nodemailer from 'nodemailer'

const  sendEmail  = async(email,subject,text)=>{
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.USER,
              pass: process.env.GMAIL_PASS,
              clientId: '432979864233-6788306bf87arfcjcsgi5n0h844647oq.apps.googleusercontent.com',
             


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