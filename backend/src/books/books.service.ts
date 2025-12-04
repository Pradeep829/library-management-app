import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    // Verify author exists
    const author = await this.prisma.author.findUnique({
      where: { id: createBookDto.authorId },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${createBookDto.authorId} not found`);
    }

    // Convert publishedAt to Date if present
    const data = { ...createBookDto };
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt) as any;
    }

    return this.prisma.book.create({
      data,
      include: {
        author: true,
        _count: {
          select: {
            borrowedBooks: true,
          },
        },
      },
    });
  }

  async findAll(filterDto?: FilterBooksDto) {
    const where: any = {};

    if (filterDto?.authorId) {
      where.authorId = filterDto.authorId;
    }

    if (filterDto?.search) {
      where.OR = [
        { title: { contains: filterDto.search, mode: 'insensitive' } },
        { isbn: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    if (filterDto?.borrowed !== undefined) {
      if (filterDto.borrowed === 'true') {
        where.borrowedBooks = {
          some: {
            returnedAt: null,
          },
        };
      } else if (filterDto.borrowed === 'false') {
        where.borrowedBooks = {
          none: {
            returnedAt: null,
          },
        };
      }
    }

    const skip = filterDto?.skip ? parseInt(filterDto.skip) : undefined;
    const take = filterDto?.take ? parseInt(filterDto.take) : undefined;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          author: true,
          borrowedBooks: {
            where: {
              returnedAt: null,
            },
            select: {
              id: true,
              userId: true,
              borrowedAt: true,
            },
          },
          _count: {
            select: {
              borrowedBooks: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      total,
      skip: skip || 0,
      take: take || total,
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        borrowedBooks: {
          include: {
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
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (updateBookDto.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: updateBookDto.authorId },
      });

      if (!author) {
        throw new NotFoundException(`Author with ID ${updateBookDto.authorId} not found`);
      }
    }

    // Convert publishedAt to Date if present
    const data = { ...updateBookDto };
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt) as any;
    }

    return this.prisma.book.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  async remove(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.prisma.book.delete({
      where: { id },
    });
  }
}


