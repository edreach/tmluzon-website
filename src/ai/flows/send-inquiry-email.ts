'use server';
/**
 * @fileOverview A flow for sending an inquiry notification email to the admin.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as nodemailer from 'nodemailer';
import type { InquiryData } from '@/lib/types';

// Define the input schema for the flow, which is the inquiry data.
const SendInquiryEmailInputSchema = z.custom<InquiryData>();
export type SendInquiryEmailInput = z.infer<typeof SendInquiryEmailInputSchema>;

// The output will be a simple success message.
const SendInquiryEmailOutputSchema = z.object({
  message: z.string(),
});
export type SendInquiryEmailOutput = z.infer<typeof SendInquiryEmailOutputSchema>;

// This is the exported function that the client will call.
export async function sendInquiryEmail(
  input: SendInquiryEmailInput
): Promise<SendInquiryEmailOutput> {
  return sendInquiryEmailFlow(input);
}

// Define the Genkit flow.
const sendInquiryEmailFlow = ai.defineFlow(
  {
    name: 'sendInquiryEmailFlow',
    inputSchema: SendInquiryEmailInputSchema,
    outputSchema: SendInquiryEmailOutputSchema,
  },
  async inquiry => {
    const { 
        customerName, 
        customerEmail, 
        customerContact, 
        message, 
        items 
    } = inquiry;

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('ADMIN_EMAIL environment variable is not set. Cannot send inquiry email.');
      // Silently fail in production, but log error.
      return { message: 'Admin email not configured.' };
    }

    if (!process.env.SMTP_HOST) {
        console.error("SMTP configuration is missing. Cannot send email.");
        return { message: 'SMTP not configured.' };
    }
    
    // Create a transporter object using SMTP transport.
    // The user will need to configure these environment variables.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      </tr>
    `).join('');

    // Email content
    const mailOptions = {
      from: `"TMLUZON Website" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: 'New Customer Inquiry Received',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Inquiry from TMLUZON Website</h2>
          <p>You have received a new inquiry. Here are the details:</p>
          <hr>
          <h3>Customer Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
            <li><strong>Contact:</strong> ${customerContact}</li>
          </ul>
          ${message ? `
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
          ` : ''}
          <hr>
          <h3>Inquired Items:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left; background-color: #f2f2f2;">Product</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; background-color: #f2f2f2;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <p>Please follow up with the customer as soon as possible.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { message: 'Email sent successfully.' };
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw to the client, just log it.
      // The main inquiry submission should not fail because of the email.
      return { message: 'Failed to send email.' };
    }
  }
);
