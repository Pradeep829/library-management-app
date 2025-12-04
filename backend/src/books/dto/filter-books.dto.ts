import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterBooksDto {
  @ApiProperty({ required: false, example: 'Harry Potter' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 'author-uuid-here' })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ required: false, example: 'true', description: 'Filter by borrowed status: true, false, or undefined' })
  @IsOptional()
  @IsString()
  borrowed?: string;

  @ApiProperty({ required: false, example: '0' })
  @IsOptional()
  @IsString()
  skip?: string;

  @ApiProperty({ required: false, example: '10' })
  @IsOptional()
  @IsString()
  take?: string;
}


