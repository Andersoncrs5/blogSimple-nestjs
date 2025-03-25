import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    private readonly userService : UserService,
    private readonly postService : PostService,
  ){}

  async create(idPost: number, idUser: number, createCommentDto: CreateCommentDto) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const user: User = await this.userService.findOne(idUser);
      const post: Post = await this.postService.findOne(idPost);

      const commentCreated = { ...createCommentDto, post, user, nameUser: user.name };
      
      const comment = queryRunner.manager.create(Comment, commentCreated);
      await queryRunner.manager.save(comment);
      await queryRunner.commitTransaction();
      return comment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error creating comment', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOfPost(id: number): Promise<Comment[]> {
    try {
      const post: Post = await this.postService.findOne(id);
      return await this.repository.find({ where: { post: { id }, isActived: true, parentId : 0 } });
    } catch (e) {
      throw new InternalServerErrorException('Error retrieving comments', e.message);
    }
  }

  async findAllOfUser(id: number): Promise<Comment[]> {
    try {
      const user: User = await this.userService.findOne(id);

      return await this.repository.find({ where: { user: { id } } });
    } catch (e) {
      throw new InternalServerErrorException('Error retrieving comments', e.message);
    }
  }

  async findOne(id: number): Promise<Comment> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const comment = await this.repository.findOne({ where: { id } });

      if (!comment) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }

      return comment;
    } catch (e) {
      throw new InternalServerErrorException('Error retrieving comment', e.message);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const comment: Comment = await this.findOne(id);

      const updatedComment = { ...comment, ...updateCommentDto };
      updatedComment.isEdited = true

      await queryRunner.manager.save(Comment, updatedComment);
      await queryRunner.commitTransaction();
      return updatedComment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating comment', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const comment: Comment | null = await queryRunner.manager.findOne(Comment, { where: { id } });

      if (!comment) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }

      const commentReplies: Comment[] = await queryRunner.manager.find(Comment, { where: { parentId: id } });

      for (const reply of commentReplies) {
        await queryRunner.manager.delete(Comment, reply.id);
      }

      await queryRunner.manager.delete(Comment, id);
      await queryRunner.commitTransaction();

      return `Comment deleted with ID: ${id}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting comment', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async createOnComment(idComment: number, idUser: number, createCommentDto: CreateCommentDto) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const comment: Comment = await this.findOne(idComment);
      const user: User = await this.userService.findOne(idUser);

      const commentCreated = queryRunner.manager.create(Comment, {
        ...createCommentDto,
        user,
        parentId: comment.id,
        post: comment.post,
        nameUser: user.name,
      });

      await queryRunner.manager.save(commentCreated);
      await queryRunner.commitTransaction();
      
      return commentCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOfComment(id: number): Promise<Comment[]> {
    try {
      const comment: Comment = await this.findOne(id);

      return await this.repository.find({ where: { parentId : id } });
    } catch (e) {
      throw new InternalServerErrorException('Error retrieving comments', e.message);
    }
  }
}