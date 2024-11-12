import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

prisma.$connect().catch((error) => {
  console.error('Error connecting to the database:', error);
});

export default prisma;

