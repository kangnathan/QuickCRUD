import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const cookie = cookies().get("mycrudapp")
    if (cookie) {
      cookies().delete("mycrudapp", { path: '/' })
    }
    return NextResponse.redirect(new URL('/', req.url))
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error.'
    }, { status: 500 })
  }
}
