import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return await this.postService.create(+req.user.sub, createPostDto);
  }

  @Get()
  @HttpCode(HttpStatus.FOUND)
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('/findAllOfUser')
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOfUser(@Req() req) {
    return await this.postService.findAllOfUser(+req.user.sub);
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(+id);
  }

  @Get('findByTitle/:title')
  @HttpCode(HttpStatus.FOUND)
  async findByTitle(@Param('title') title: string) {
    return await this.postService.findByTitle(title);
  }

  @Get('findByCategory/:category')
  @HttpCode(HttpStatus.FOUND)
  async findByCategory(@Param('category') category: string) {
    return await this.postService.findByCategory(category);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return await this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.postService.remove(+id);
  }
}
