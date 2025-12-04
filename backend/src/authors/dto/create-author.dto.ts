import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'British author, best known for the Harry Potter series', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}


