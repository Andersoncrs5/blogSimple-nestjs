import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from "src/comment/entities/comment.entity";
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User])], 
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
