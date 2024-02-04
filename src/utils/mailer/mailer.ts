import nodeMailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { env } from "../../config/env.config";
import { Logger } from "../logger";

type Options = {
  email: string;
  subject: string;
  message: string;
};
const sendEmail = async (options: Options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      service: "gmail",
      auth: {
        user: env.NODEMAILER_EMAIL,
        pass: env.NODEMAILER_EMAIL_PASSWORD,
      },
    });

    const mailOptions: MailOptions = {
      from: env.NODEMAILER_EMAIL,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    Logger.error("send email failed " + err);
  }
};

export default sendEmail;
