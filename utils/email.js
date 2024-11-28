import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
import pug from "pug";
import { fileURLToPath } from "url";
import path from "path";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM || "no-reply@example.com"; // Use a default if undefined
  }

  // Create transport based on environment
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // SendGrid for production
      return nodemailer.createTransport({
        service: "GMAIL",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Local SMTP for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    try {
      // 1) Render HTML based on Pug template
      const templatePath = path.resolve(
        __dirname,
        "../views/email",
        `${template}.pug`
      );
      const html = pug.renderFile(templatePath, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html), // Automatically generates text version
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      console.error(`Error sending email: ${err.message}`);
      throw new Error("Email could not be sent");
    }
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Paras Invoice System!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}

export default Email;
