// app/api/auth/verify-otp/route.js
const otpStore = {}; // Reuse the same in-memory storage

export async function POST(req) {
    const { email, otp } = await req.json();

    // Check if the OTP exists and is not expired
    const storedOtpData = otpStore[email];
    if (!storedOtpData || storedOtpData.expires < Date.now()) {
        return new Response(JSON.stringify({ message: 'OTP expired or invalid.' }), { status: 400 });
    }

    if (storedOtpData.otp !== otp) {
        return new Response(JSON.stringify({ message: 'Incorrect OTP.' }), { status: 400 });
    }

    delete otpStore[email]; // Clear OTP after verification
    return new Response(JSON.stringify({ message: 'OTP verified. Proceed to reset password.' }), { status: 200 });
}
