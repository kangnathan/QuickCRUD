
import sgMail from "@sendgrid/mail";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const SENDGRID_API_KEY = "<put api key here>"; // put api key here
sgMail.setApiKey(SENDGRID_API_KEY);

export const otpStore = {}; 


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); 
}

export async function sendOtpToEmail(email) {
    if (!email || typeof email !== 'string') {
        throw new Error('Invalid email format');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log(`Attempt to reset password for unregistered email: ${email}`);
            throw new Error('Email not found');
        }

        const otp = generateOTP();
        console.log(`Generated OTP for ${email}: ${otp}`);


        otpStore[email] = otp;
        setTimeout(() => delete otpStore[email], 300000);


        const msg = {
            to: email,
            from: 'karlnathanr@gmail.com', 
            subject: 'QuickCRUD OTP',
            text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
        };

        await sgMail.send(msg);
        console.log(`OTP sent to ${email}`);

        return otp;
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error);
        throw new Error('Failed to send OTP. Please try again later.');
    }
}

export function verifyOtp(email, otp) {
    const storedOtp = otpStore[email];
    if (storedOtp && storedOtp.toString() === otp) {
        delete otpStore[email];
        return true;
    } else {
        return false;
    }
}
