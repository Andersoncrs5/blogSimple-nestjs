import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':id')
  async create(@Param('id') id: number, @Body() createPostDto: CreatePostDto) {
    return await this.postService.create(id, createPostDto);
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('/findAllOfUser/:id')
  async findAllOfUser(@Param('id') id: number) {
    return await this.postService.findAllOfUser(id);
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
