import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return await this.postService.create(+req.user.sub, createPostDto);
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('/findAllOfUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOfUser(@Req() req) {
    return await this.postService.findAllOfUser(+req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(+id);
  }

  @Get('findByTitle/:title')
  async findByTitle(@Param('title') title: string) {
    return await this.postService.findByTitle(title);
  }

  @Get('findByCategory/:category')
  async findByCategory(@Param('category') category: string) {
    return await this.postService.findByCategory(category);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return await this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postService.remove(+id);
  }
}
