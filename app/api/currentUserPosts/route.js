import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyTokenMiddleware } from '@/app/middleware';

export const dynamic = 'force-dynamic';

async function getPostsByUser({ userId, startDate, endDate, showDeleted, title }) {
  const filter = { authorId: userId };

  if (startDate) {
    filter.createdAt = { gte: new Date(startDate) };
  }

  if (endDate) {
    filter.createdAt = { lte: new Date(endDate) };
  }

  filter.deleted = showDeleted === 'show';

  if (title) {
    filter.title = { contains: title, mode: 'insensitive' };
  }

  try {
    const posts = await prisma.post.findMany({
      where: filter,
      include: {
        author: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => ({
      ...post,
      authorName: post.author ? post.author.name : 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function GET(request) {
  const tokenResult = await verifyTokenMiddleware(request);

  if (tokenResult instanceof NextResponse) {
    return tokenResult;
  }

  const userId = tokenResult.userId;

  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const showDeleted = url.searchParams.get('showDeleted');
  const title = url.searchParams.get('title');

  const posts = await getPostsByUser({ userId, startDate, endDate, showDeleted, title });
  
  return NextResponse.json({ posts });
}

export async function POST(req) {
  const tokenResult = await verifyTokenMiddleware(req);

  if (tokenResult instanceof NextResponse) {
    return tokenResult;
  }

  const userId = tokenResult.userId;

  try {
    const { title, content } = await req.json();

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: userId }
        }
      }
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
