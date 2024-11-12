import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import JWTService from '@/lib/jwtService';

export async function verifyTokenMiddleware(req) {
  const cookie = cookies().get('mycrudapp');
  const token = cookie ? cookie.value : null;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); 
  }

  try {
    const decoded = JWTService.verify(token);
    return { userId: decoded.userId }; 
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.redirect(new URL('/login', req.url)); 
  }
}
