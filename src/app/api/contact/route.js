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
      subject: `✨ New Query from ${name} (${company || 'Individual'})`,
      html: `
        <div style="background-color: #0c0c0e; padding: 50px 20px; font-family: 'Courier New', Courier, monospace; color: #f5f5f7; text-align: center;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #121214; border: 1px solid rgba(193, 156, 92, 0.2); border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
            
            <!-- Monogram Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="display: inline-block; font-size: 28px; font-weight: bold; border: 1px solid #c19c5c; color: #c19c5c; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; text-align: center; background-color: rgba(193, 156, 92, 0.05);">S</span>
              <h1 style="font-size: 18px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; color: #ffffff; margin-top: 15px;">New Lead Query</h1>
              <div style="width: 30px; height: 2px; bg-color: #c19c5c; background: #c19c5c; margin: 10px auto;"></div>
            </div>

            <!-- Query Info Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px 0; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; width: 35%;">Client Name:</td>
                <td style="padding: 10px 0; color: #ffffff; font-weight: bold;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px 0; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em;">Email Address:</td>
                <td style="padding: 10px 0; color: #c19c5c; font-weight: bold;"><a href="mailto:${email}" style="color: #c19c5c; text-decoration: none;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px 0; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em;">Company:</td>
                <td style="padding: 10px 0; color: #ffffff;">${company || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px 0; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em;">Engagement:</td>
                <td style="padding: 10px 0; color: #ffffff;"><span style="background-color: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 12px; font-size: 11px;">${engagement}</span></td>
              </tr>
            </table>

            <!-- Client Message -->
            <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 30px;">
              <span style="font-size: 9px; font-weight: bold; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.15em; display: block; margin-bottom: 10px;">Message Detail</span>
              <p style="font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.8); margin: 0; white-space: pre-line;">${message || 'No message content provided.'}</p>
            </div>

            <!-- Footer Action -->
            <div style="text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 30px; background-color: #ffffff; color: #000000; font-size: 11px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; border-radius: 30px; transition: background 0.3s;">Reply Instantly</a>
            </div>

          </div>
        </div>
      `,
    };

    // Auto-reply email to the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✨ Message Received - Shubham Kushwaha',
      html: `
        <div style="background-color: #0c0c0e; padding: 50px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f7; text-align: center;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #121214; border: 1px solid rgba(193, 156, 92, 0.25); border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
            
            <!-- Monogram Header -->
            <div style="text-align: center; margin-bottom: 35px;">
              <span style="display: inline-block; font-size: 26px; font-weight: bold; border: 1px solid #c19c5c; color: #c19c5c; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; text-align: center; background-color: rgba(193, 156, 92, 0.05);">S</span>
              <h1 style="font-size: 15px; font-weight: bold; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; margin-top: 15px; font-family: monospace;">SHUBHAM KUSHWAHA</h1>
              <span style="font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.1em;">Full Stack Developer</span>
            </div>

            <!-- Greeting -->
            <h2 style="font-size: 20px; font-weight: normal; color: #ffffff; margin-bottom: 15px;">Hello ${name},</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); margin-bottom: 25px;">
              Thank you for reaching out! I've received your query regarding <strong style="color: #c19c5c;">${engagement}</strong> and will review the details right away.
            </p>

            <p style="font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); margin-bottom: 30px;">
              I strive to respond to all inquiries within <strong>24 hours</strong>. In the meantime, feel free to check out my latest works and interactive code logs on my portfolio.
            </p>

            <!-- Divider -->
            <div style="width: 100%; height: 1px; background-color: rgba(255,255,255,0.06); margin-bottom: 30px;"></div>

            <!-- Contact Signoff -->
            <table style="width: 100%;">
              <tr>
                <td>
                  <p style="font-size: 13px; font-weight: bold; color: #ffffff; margin: 0 0 5px 0;">Shubham Kushwaha</p>
                  <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); margin: 0;">Rewa, Madhya Pradesh, India</p>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                  <a href="https://github.com/SHUBHAMREWA" style="display: inline-block; margin-left: 10px; color: rgba(255,255,255,0.4); text-decoration: none; font-size: 12px;">GitHub</a>
                  <a href="https://linkedin.com" style="display: inline-block; margin-left: 15px; color: rgba(255,255,255,0.4); text-decoration: none; font-size: 12px;">LinkedIn</a>
                </td>
              </tr>
            </table>

          </div>
        </div>
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
