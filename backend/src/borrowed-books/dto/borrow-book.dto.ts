import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({ example: 'book-uuid-here' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: 'user-uuid-here' })
  @IsUUID()
  userId: string;
}


