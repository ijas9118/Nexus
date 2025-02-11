import nodemailer from "nodemailer";
import { APP_PASSWORD, USER_EMAIL } from "./constants";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: USER_EMAIL,
    pass: APP_PASSWORD,
  },
});
