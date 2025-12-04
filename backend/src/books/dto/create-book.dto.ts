import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Harry Potter and the Philosopher\'s Stone' })
  @IsString()
  title: string;

  @ApiProperty({ example: '978-0747532699', required: false })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiProperty({ example: '1997-06-26', required: false })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({ example: 'author-uuid-here' })
  @IsUUID()
  authorId: string;
}


