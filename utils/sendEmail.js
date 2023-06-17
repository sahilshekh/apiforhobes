const nodeMailer = require('nodemailer');

const sendEmail =async(options)=>{
    //1) create a transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
         service : process.env.SMPT_SERVICE,
           auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });
    //2) Define the email options
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

 await transporter.sendMail(mailOptions);

}
module.exports=sendEmail;