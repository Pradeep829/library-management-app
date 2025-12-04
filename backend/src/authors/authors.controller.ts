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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Authors')
@Controller('authors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'Author successfully created' })
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ status: 200, description: 'List of all authors' })
  async findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get author by ID' })
  @ApiResponse({ status: 200, description: 'Author details' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async findOne(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update author' })
  @ApiResponse({ status: 200, description: 'Author successfully updated' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete author' })
  @ApiResponse({ status: 200, description: 'Author successfully deleted' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}


