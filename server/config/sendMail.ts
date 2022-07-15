const nodemailer = require('nodemailer');
import { OAuth2Client } from "google-auth-library";

const  OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const  CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const  CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const  REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;

//SEND MAIN
const sendEmail =async (to:string, url:string, txt:string) => {
    const oAuth2Client = new OAuth2Client(
        CLIENT_ID, CLIENT_SECRET, OAUTH_PLAYGROUND
    );

    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN })

    try {
        const access_token = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth:{
                type: "OAuth2",
                user: SENDER_MAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                access_token
            }
        });

        const mailOptions={
            from: SENDER_MAIL,
            to: to,
            subject: "O Manicômio",
            html:`
                <h1>Acesse o Link para Validar sua conta e ativa-la</h1>
                <p>O Manicômico agradece!</p>
                <p>${url}</p>
                
                
            `
        }

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.log(error);
        
    }
}

export default sendEmail;