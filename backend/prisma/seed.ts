import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: {
      email: 'admin@library.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
    },
  });

  // Create authors
  const author1 = await prisma.author.create({
    data: {
      name: 'J.K. Rowling',
      bio: 'British author, best known for the Harry Potter series',
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'George R.R. Martin',
      bio: 'American novelist and short story writer, best known for A Song of Ice and Fire',
    },
  });

  const author3 = await prisma.author.create({
    data: {
      name: 'Jane Austen',
      bio: 'English novelist known primarily for her six major novels',
    },
  });

  // Create books
  const book1 = await prisma.book.create({
    data: {
      title: 'Harry Potter and the Philosopher\'s Stone',
      isbn: '978-0747532699',
      publishedAt: new Date('1997-06-26'),
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Harry Potter and the Chamber of Secrets',
      isbn: '978-0747538493',
      publishedAt: new Date('1998-07-02'),
      authorId: author1.id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'A Game of Thrones',
      isbn: '978-0553103540',
      publishedAt: new Date('1996-08-01'),
      authorId: author2.id,
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      isbn: '978-0141439518',
      publishedAt: new Date('1813-01-28'),
      authorId: author3.id,
    },
  });

  // Create some borrowed books
  await prisma.borrowedBook.create({
    data: {
      bookId: book1.id,
      userId: user2.id,
      borrowedAt: new Date(),
    },
  });

  console.log('Seeding completed!');
  console.log('Test user credentials:');
  console.log('Email: admin@library.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


