import nodemailer from "nodemailer";

import { env } from "../utils/env-validation";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: env.USER_EMAIL,
    pass: env.APP_PASSWORD,
  },
});
