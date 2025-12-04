import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({ example: 'Updated Title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: '978-0747532699', required: false })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiProperty({ example: '1997-06-26', required: false })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({ example: 'author-uuid-here', required: false })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}


