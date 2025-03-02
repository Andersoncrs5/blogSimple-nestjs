import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoritePostService } from './favorite_post.service';
import { CreateFavoritePostDto } from './dto/create-favorite_post.dto';
import { UpdateFavoritePostDto } from './dto/update-favorite_post.dto';

@Controller('favorite-post')
export class FavoritePostController {
  constructor(private readonly favoritePostService: FavoritePostService) {}

  @Post()
  async create(@Body() createFavoritePostDto: CreateFavoritePostDto) {
    return await this.favoritePostService.create(createFavoritePostDto);
  }

  @Get('/findAllOfUser/:id')
  async findAllOfUser(@Param('id') id: string) {
    return this.favoritePostService.findAllOfUser(+id);
  }

  @Get('/exists/:idUser/:idPost')
  exists(@Param('idUser') idUser: number, @Param('idPost') idPost: number ) {
    return this.favoritePostService.exists(idUser, idPost);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritePostService.remove(+id);
  }
}
