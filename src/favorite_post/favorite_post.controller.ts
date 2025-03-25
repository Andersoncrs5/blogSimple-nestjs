import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FavoritePostService } from './favorite_post.service';
import { CreateFavoritePostDto } from './dto/create-favorite_post.dto';
import { UpdateFavoritePostDto } from './dto/update-favorite_post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('favorite-post')
export class FavoritePostController {
  constructor(private readonly service: FavoritePostService) {}

  @Post()
  async create(@Body() createFavoritePostDto: CreateFavoritePostDto) {
    return await this.service.create(createFavoritePostDto);
  }

  @Get('/findAllofUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOfUser(@Req() req) {
    return this.service.findAllOfUser(+req.user.sub);
  }

  @Get('/exists/:idPost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async exists(@Req() req, @Param('idPost') idPost: number ) {
    return await this.service.exists(+req.user.sub, idPost);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
