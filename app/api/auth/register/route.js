
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import JWTService from '@/lib/jwtService';
import { validateUser } from '@/utils/validateUser'; 

export async function POST(req) {
  const formData = await req.json();

  const ourUser = {
    name: formData.name || '',
    email: formData.email || '',
    password: formData.password || ''
  };

  const errors = await validateUser(ourUser); 

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors: errors, success: false }, { status: 400 });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    ourUser.password = bcrypt.hashSync(ourUser.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: ourUser.name,
        email: ourUser.email,
        password: ourUser.password
      }
    });

    const ourTokenValue = JWTService.sign({ userId: newUser.id });

    const response = NextResponse.json({ success: true });
    response.cookies.set('mycrudapp', ourTokenValue, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Error during user registration:', error.message || error);
    return NextResponse.json({
      error: 'Internal server error.',
      success: false
    }, { status: 500 });
  }
}
