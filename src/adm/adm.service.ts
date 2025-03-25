import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdmService {
    constructor(
      private readonly userService : UserService,
      private readonly postService : PostService,
      private readonly commentService : CommentService,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Comment)
      private readonly commentRepository: Repository<Comment>,
      @InjectRepository(Post)
      private readonly postRepository: Repository<Post>,
    ){}

    public async getAllCommentBlockeds(): Promise<Comment[]> {
        try {
          const comments = await this.commentRepository.find({ where : { isBlocked: true } });

          return comments;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
    }

    public async getAllPostBlockeds(): Promise<Post[]> {
        try {
          const posts = await this.postRepository.find({ where : { isBlocked: true } });

          return posts;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
    }

    public async getAllUserBlockeds(): Promise<User[]> {
        try {
          const users = await this.userRepository.find({ where : { isBlocked: true } });

          return users;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
    }

    public async blockOrUnblockUser(userId: number) : Promise<{message: string;'status of user': boolean;}>{
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        
        try {
          const user : User = await this.userService.findOne(userId);
          
          user.isBlocked = !user.isBlocked;

          await queryRunner.manager.update(User, userId, user);
          await queryRunner.commitTransaction();
        
          return { 'message': 'Alter with success', 'status of user' : user.isBlocked };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new InternalServerErrorException(error);
        } finally {
          await queryRunner.release();
        }
    }

    public async blockOrUnblockPost(postId: number) : Promise<{message: string;'status': boolean;}>{
        const queryRunner = this.postRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        
        try {
          const post : Post = await this.postService.findOne(postId);
          
          post.isBlocked = !post.isBlocked;

          await queryRunner.manager.update(Post, postId, post);
          await queryRunner.commitTransaction();
        
          return { 'message': 'Alter with success!!', 'status' : post.isBlocked };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new InternalServerErrorException(error);
        } finally {
          await queryRunner.release();
        }
    }

    public async blockOrUnblockComment(commentId: number) : Promise<{message: string;'status': boolean;}>{
        const queryRunner = this.commentRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        
        try {
          const comment : Comment = await this.commentService.findOne(commentId);
          
          comment.isBlocked = !comment.isBlocked;

          await queryRunner.manager.update(Comment, commentId, comment);
          await queryRunner.commitTransaction();
        
          return { 'message': 'Alter with success!!', 'status' : comment.isBlocked };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new InternalServerErrorException(error);
        } finally {
          await queryRunner.release();
        }
    }

    public async turnUserInAdm(userId: number): Promise<{message: string;'status of user': boolean;}> {
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        
        try {
          const user : User = await this.userService.findOne(userId);
          
          user.isAdm = !user.isAdm;

          await queryRunner.manager.update(User, userId, user);
          await queryRunner.commitTransaction();
        
          return { 'message': 'Alter with success', 'status of user' : user.isAdm };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new InternalServerErrorException(error);
        } finally {
          await queryRunner.release();
        }
    }

    

}