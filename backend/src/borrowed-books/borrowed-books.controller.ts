import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Borrowed Books')
@Controller('borrowed-books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BorrowedBooksController {
  constructor(private readonly borrowedBooksService: BorrowedBooksService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book successfully borrowed' })
  @ApiResponse({ status: 400, description: 'Book is already borrowed' })
  async borrow(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrow(borrowBookDto);
  }

  @Post('return/:bookId/:userId')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiResponse({ status: 200, description: 'Book successfully returned' })
  @ApiResponse({ status: 404, description: 'Borrowed record not found' })
  async return(@Param('bookId') bookId: string, @Param('userId') userId: string) {
    return this.borrowedBooksService.return(bookId, userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all borrowed books for a user' })
  @ApiResponse({ status: 200, description: 'List of borrowed books' })
  async findAllByUser(@Param('userId') userId: string) {
    return this.borrowedBooksService.findAllByUser(userId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active borrowed books' })
  @ApiResponse({ status: 200, description: 'List of active borrowed books' })
  async findAllActive() {
    return this.borrowedBooksService.findAllActive();
  }
}


