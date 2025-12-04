import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaService;

  const mockPrismaService = {
    book: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    author: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createBookDto = {
        title: 'Test Book',
        authorId: 'author-id',
      };

      const mockAuthor = { id: 'author-id', name: 'Test Author' };
      const mockBook = { id: 'book-id', ...createBookDto, author: mockAuthor };

      mockPrismaService.author.findUnique.mockResolvedValue(mockAuthor);
      mockPrismaService.book.create.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(result).toEqual(mockBook);
      expect(mockPrismaService.author.findUnique).toHaveBeenCalledWith({
        where: { id: createBookDto.authorId },
      });
      expect(mockPrismaService.book.create).toHaveBeenCalledWith({
        data: createBookDto,
        include: {
          author: true,
          _count: { select: { borrowedBooks: true } },
        },
      });
    });

    it('should throw NotFoundException if author does not exist', async () => {
      const createBookDto = {
        title: 'Test Book',
        authorId: 'non-existent-author',
      };

      mockPrismaService.author.findUnique.mockResolvedValue(null);

      await expect(service.create(createBookDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ];

      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);
      mockPrismaService.book.count.mockResolvedValue(2);

      const result = await service.findAll();

      expect(result.data).toEqual(mockBooks);
      expect(result.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const mockBook = { id: 'book-id', title: 'Test Book' };

      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);

      const result = await service.findOne('book-id');

      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});


