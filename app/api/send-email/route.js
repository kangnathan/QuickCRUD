import bcrypt from 'bcryptjs';
import { sendOtpToEmail, verifyOtp, otpStore } from '@/lib/emailService';
import prisma from '@/lib/prisma';

export async function POST(req) {
    const { email } = await req.json();

    try {
        const otp = await sendOtpToEmail(email);
        return new Response(JSON.stringify({ message: "OTP sent to registered email", otp }), { status: 200 });
    } catch (error) {
        console.error('Error:', error.message);
        return new Response(JSON.stringify({ message: error.message }), { status: error.message === 'Email not found' ? 404 : 400 });
    }
}

export async function PUT(req) {
    const { email, otp, newPassword } = await req.json();

    try {
        const isValidOtp = verifyOtp(email, otp);
        if (!isValidOtp) {
            return new Response(JSON.stringify({ message: 'Invalid or expired OTP' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        delete otpStore[email];

        return new Response(JSON.stringify({ message: "Password changed successfully" }), { status: 200 });
    } catch (error) {
        console.error('Error changing password:', error);
        return new Response(JSON.stringify({ message: 'Failed to change password', error: error.message }), { status: 500 });
    }
}
