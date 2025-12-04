import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthorDto {
  @ApiProperty({ example: 'J.K. Rowling', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Updated bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}


