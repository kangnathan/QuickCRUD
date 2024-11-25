import bcrypt from 'bcryptjs';
import { sendOtpToEmail, verifyOtp, otpStore } from '@/lib/emailService';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email } = await req.json();
        const otp = await sendOtpToEmail(email);

        return NextResponse.json(
            { message: "OTP sent to registered email", otp },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending OTP:', error.message);

        return NextResponse.json(
            { message: error.message },
            { status: error.message === 'Email not found' ? 404 : 400 }
        );
    }
}

export async function PUT(req) {
    try {
        const { email, otp, newPassword } = await req.json();
        const isValidOtp = verifyOtp(email, otp);

        if (!isValidOtp) {
            return NextResponse.json(
                { message: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        delete otpStore[email];

        return NextResponse.json(
            { message: "Password changed successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error changing password:', error.message);

        return NextResponse.json(
            { message: "Failed to change password", error: error.message },
            { status: 500 }
        );
    }
}
