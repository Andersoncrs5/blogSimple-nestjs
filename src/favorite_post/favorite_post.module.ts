import { Module } from '@nestjs/common';
import { FavoritePostService } from './favorite_post.service';
import { FavoritePostController } from './favorite_post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritePost } from './entities/favorite_post.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritePost, User, Post])], 
  controllers: [FavoritePostController],
  providers: [FavoritePostService],
})
export class FavoritePostModule {}
