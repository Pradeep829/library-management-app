import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Books')
@Controller('books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book successfully created' })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with optional filters' })
  @ApiResponse({ status: 200, description: 'List of books' })
  async findAll(@Query() filterDto: FilterBooksDto) {
    return this.booksService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 200, description: 'Book details' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update book' })
  @ApiResponse({ status: 200, description: 'Book successfully updated' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete book' })
  @ApiResponse({ status: 200, description: 'Book successfully deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}


