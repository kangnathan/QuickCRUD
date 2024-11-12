import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import JWTService from '@/lib/jwtService';

export async function POST(req) {
  const failObject = {
    success: false,
    message: "Invalid email/username or password."
  };

  try {
    const formData = await req.json();
    const { emailOrUsername = '', password = '' } = formData;
    const trimmedEmailOrUsername = emailOrUsername.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmailOrUsername || !trimmedPassword) {
      return NextResponse.json(
        { ...failObject, message: 'Email/username and password are required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedEmailOrUsername },
          { name: trimmedEmailOrUsername }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(failObject, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json(failObject, { status: 401 });
    }

    // Generate JWT token
    const token = JWTService.sign({ userId: user.id });

    // Set JWT as an HTTP-only cookie
    const cookie = cookies();
    cookie.set('mycrudapp', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production', // Use secure only in production
      path: '/'
    });

    // Debug logging
    console.log('Token set in cookie:', token);
    console.log('Current cookies:', cookie.getAll());

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Login successful.'
    });
  } catch (error) {
    console.error('Error during login:', error);
    
    // Return internal server error
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error.'
      },
      { status: 500 }
    );
  }
}
