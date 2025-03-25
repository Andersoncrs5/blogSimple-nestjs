import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Get('/findAllofUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOfUser(@Req() req) {
    return this.likeService.findAllOfUser(+req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(+id);
  }

  @Get('/exists/:idPost/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async exists(@Param('idPost') idPost: number, @Req() req) {
    return await this.likeService.exists(+req.user.sub, idPost);
  }

  @Get('/CountLikeByPost/:id')
  async countLikeByPost(@Param('id') id: number) {
    return await this.likeService.CountLikeByPost(id);
  }

}