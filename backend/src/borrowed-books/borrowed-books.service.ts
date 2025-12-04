import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrow(borrowBookDto: BorrowBookDto) {
    // Check if book exists
    const book = await this.prisma.book.findUnique({
      where: { id: borrowBookDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${borrowBookDto.bookId} not found`);
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: borrowBookDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${borrowBookDto.userId} not found`);
    }

    // Check if book is already borrowed and not returned
    const existingBorrow = await this.prisma.borrowedBook.findFirst({
      where: {
        bookId: borrowBookDto.bookId,
        returnedAt: null,
      },
    });

    if (existingBorrow) {
      throw new BadRequestException('This book is already borrowed');
    }

    return this.prisma.borrowedBook.create({
      data: {
        bookId: borrowBookDto.bookId,
        userId: borrowBookDto.userId,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async return(bookId: string, userId: string) {
    const borrowedBook = await this.prisma.borrowedBook.findFirst({
      where: {
        bookId,
        userId,
        returnedAt: null,
      },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowed record not found or already returned');
    }

    return this.prisma.borrowedBook.update({
      where: { id: borrowedBook.id },
      data: {
        returnedAt: new Date(),
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAllByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.borrowedBook.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async findAllActive() {
    return this.prisma.borrowedBook.findMany({
      where: {
        returnedAt: null,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }
}


