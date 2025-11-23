// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



/**
 * Sends an email with the given subject and message
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - email HTML content
 */
interface SendEmailArgs {
    to: string | string[];
    subject: string;
    html: string;
}

export async function sendEmail(
    to: SendEmailArgs["to"],
    subject: SendEmailArgs["subject"],
    html: SendEmailArgs["html"]
): Promise<void> {
    try {
        await transporter.sendMail({
            from: `"Connectify" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        } as nodemailer.SendMailOptions);
        console.log(`📧 Email sent to ${to}`);
    } catch (error: unknown) {
        console.error("Error sending email:", error);
        throw error;
    }
}
