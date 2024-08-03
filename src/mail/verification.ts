import { IUser } from "@/models/User";
import nodemailer from "nodemailer";
const sendMail = async (user: IUser, code: string) => {
  let transporter = nodemailer.createTransport({
    name: "Find a Nurse",
    host: "mail.ehtechfoundation.org",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "it@ehtechfoundation.org", // username for your mail server
      pass: "G}(Xbqd@f*sz", // password
    },
  }); // send mail with defined transport object

  let info = await transporter.sendMail(
    {
      from: '"Find a Nurse" <it@ehtechfoundation.org>', // sender address
      to: user.email, // list of receivers seperated by comma
      subject: "FAN Account Verification Code", // Subject line
      html: `
        Hello ${user.name},<br> Your verification code.<br>
        <span style="font-size:32;font-weight:bold">${code}</span>
        `,
    },
    (error, info) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Message sent successfully!");
      // console.log(info);
      transporter.close();
    }
  );
};
export default sendMail;
