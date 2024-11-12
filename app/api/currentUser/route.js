import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyTokenMiddleware } from '@/app/middleware';


async function getUserData(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return user || { error: 'User not found' };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { error: 'Error retrieving user data' };
  }
}

export async function GET(request) {
  const tokenResult = await verifyTokenMiddleware(request);

  if (tokenResult instanceof NextResponse) {
    return tokenResult; 
  }

  const userId = tokenResult.userId; 
  const userData = await getUserData(userId);

  if (userData.error) {
    return NextResponse.json({ error: userData.error }, { status: 404 });
  }

  return NextResponse.json({ user: userData });
}

export async function PUT(req) {
  const cookie = cookies().get("mycrudapp")
  const token = cookie ? cookie.value : null 

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 })
  }

  try {
    const decoded = JWTService.verify(token)
    const userId = decoded.userId

    const { name, originalPassword, newPassword } = await req.json()
    const errors = {}

    if (!name && !newPassword) {
      return NextResponse.json({ message: 'Name or password is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (newPassword) {
      if (!originalPassword) {
        return NextResponse.json({ message: 'Original password is required to change the password' }, { status: 400 })
      }

      const isPasswordCorrect = await bcrypt.compare(originalPassword, user.password)
      if (!isPasswordCorrect) {
        return NextResponse.json({ message: 'Incorrect original password' }, { status: 400 })
      }

      if (newPassword.length < 12) {
        errors.password = 'Password must be at least 12 characters.'
      } else if (newPassword.length > 50) {
        errors.password = 'Password cannot exceed 50 characters.'
      }

      if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors, success: false }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      })
    }

    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name }
      })
    }

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    return NextResponse.json({ message: 'Error updating user', error: error.message }, { status: 500 })
  }
}