import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Get('/findAllofUser/:id')
  async findAllofUser(@Param('id') id: number) {
    return this.likeService.findAllofUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(+id);
  }

  @Get('/exists/:idPost/:idUser')
  async exists(@Param('idPost') idPost: number, @Param('idUser') idUser: number) {
    return await this.likeService.exists(idUser, idPost);
  }

  @Get('/CountLikeByPost/:id')
  async countLikeByPost(@Param('id') id: number) {
    return await this.likeService.CountLikeByPost(id);
  }

}