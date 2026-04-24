import { NextResponse } from 'next/server';
import { readCollection, addItem } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const data = await readCollection('messages');
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  // 1. Save to Database
  const msg = await addItem('messages', {
    name,
    email,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });

  // 2. Send Email Notification via Resend
  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'pawarmalhar505@gmail.com',
        subject: `New Message from ${name} via Portfolio`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981;">New Portfolio Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${message}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af;">This message was sent from your portfolio website contact form.</p>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    // We still return success: true because the message was saved to the DB
  }

  return NextResponse.json({ success: true, id: msg.id }, { status: 201 });
}
