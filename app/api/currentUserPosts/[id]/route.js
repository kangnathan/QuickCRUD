import prisma from '@/lib/prisma';
import { verifyTokenMiddleware } from '@/app/middleware'; 
import { NextResponse } from 'next/server';

function formatDateTime(date) {
  return date.toISOString();
}

export async function PATCH(req, { params }) {
  const tokenResult = await verifyTokenMiddleware(req);


  if (tokenResult instanceof Response) {
    return tokenResult; 
  }

  const { userId } = tokenResult; 
  const { id } = params;
  const { color, pinned } = await req.json(); 

  try {
    const post = await prisma.post.findUnique({ where: { id: String(id) } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedData = {};
    if (typeof pinned !== 'undefined') {
      updatedData.pinned = pinned; 
    }
    if (color) {
      updatedData.color = color; 
    }

    const updatedPost = await prisma.post.update({
      where: { id: String(id) },
      data: updatedData,
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const tokenResult = await verifyTokenMiddleware(req);


  if (tokenResult instanceof Response) {
    return tokenResult; 
  }

  const { userId } = tokenResult; 
  const { id } = params;
  const { title, content } = await req.json();

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, updatedAt: new Date() },
    });

    updatedPost.createdAt = formatDateTime(updatedPost.createdAt);
    updatedPost.updatedAt = formatDateTime(updatedPost.updatedAt);

    return NextResponse.json({ success: true, data: updatedPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const tokenResult = await verifyTokenMiddleware(req);


  if (tokenResult instanceof Response) {
    return tokenResult; 
  }

  const { userId } = tokenResult; 
  const { id } = params;

  try {
    const deletedPost = await prisma.post.update({
      where: { id },
      data: { deleted: true, deletedAt: new Date() },
    });

    deletedPost.createdAt = formatDateTime(deletedPost.createdAt);
    deletedPost.updatedAt = formatDateTime(deletedPost.updatedAt);
    deletedPost.deletedAt = formatDateTime(deletedPost.deletedAt);

    return NextResponse.json({ success: true, data: deletedPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
