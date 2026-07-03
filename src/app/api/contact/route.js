import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, engagement, message } = body;

    // Validate inputs
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to another provider if needed
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to the owner (you)
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Contact Query from ${name}`,
      html: `
        <h2>New Query Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Engagement Type:</strong> ${engagement}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided.'}</p>
      `,
    };

    // Auto-reply email to the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <h3>Hi ${name},</h3>
        <p>Thank you for reaching out! I have received your message regarding <strong>${engagement}</strong>.</p>
        <p>I will get back to you as soon as possible.</p>
        <br/>
        <p>Best regards,</p>
        <p>Shubham Kushwaha</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
