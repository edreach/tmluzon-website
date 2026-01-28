'use server';
/**
 * @fileOverview A flow for sending an inquiry notification email to the admin.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as nodemailer from 'nodemailer';
import type { InquiryData, SiteSettings } from '@/lib/types';
import { adminDb } from '@/firebase/server';


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
    // 1. Fetch notification settings from Firestore
    const settingsDocRef = adminDb.doc('admin/dashboard/settings/tmluzon');
    let notifySettings;
    try {
        const settingsDoc = await settingsDocRef.get();
        if (!settingsDoc.exists) {
            console.error('Site settings document not found. Cannot send inquiry email.');
            return { message: 'Site settings not configured.' };
        }
        const settings = settingsDoc.data() as SiteSettings;
        notifySettings = settings.notificationSettings;
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return { message: 'Could not fetch notification settings.' };
    }
    
    // 2. Validate settings
    if (!notifySettings || !notifySettings.recipients || notifySettings.recipients.length === 0) {
        console.log('No notification recipients configured in Firestore. Skipping email.');
        return { message: 'No recipients configured.' };
    }
    
    if (!notifySettings.smtpHost || !notifySettings.smtpPort || !notifySettings.smtpUser || !notifySettings.smtpPass) {
        console.error("SMTP configuration is missing in site settings. Cannot send email.");
        return { message: 'SMTP not configured in settings.' };
    }

    const { 
        customerName, 
        customerEmail, 
        customerContact, 
        message, 
        items 
    } = inquiry;

    // 3. Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: notifySettings.smtpHost,
      port: Number(notifySettings.smtpPort),
      secure: Number(notifySettings.smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: notifySettings.smtpUser,
        pass: notifySettings.smtpPass,
      },
    });

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      </tr>
    `).join('');

    // 4. Define Email content
    const mailOptions = {
      from: `"TMLUZON Website" <${notifySettings.smtpUser}>`,
      to: notifySettings.recipients.join(','),
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

    // 5. Send email
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
