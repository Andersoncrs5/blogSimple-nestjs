import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ){}

  async create(idPost: number, idUser: number, createCommentDto: CreateCommentDto) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      if (!idPost || isNaN(idPost) || idPost <= 0) {
        throw new BadRequestException('Post ID must be a positive number');
      }

      if (!idUser || isNaN(idUser) || idUser <= 0) {
        throw new BadRequestException('User ID must be a positive number');
      }

      const user: User | null = await this.userRepository.findOne({ where: { id: idUser } });

      if (!user) {
        throw new NotFoundException(`User not found with ID: ${idUser}`);
      }

      const post: Post | null = await this.postRepository.findOne({ where: { id: idPost } });

      if (!post) {
        throw new NotFoundException(`Post not found with ID: ${idPost}`);
      }

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
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const post: Post | null = await this.postRepository.findOne({ where: { id } });

      if (!post) {
        throw new NotFoundException(`Post not found with ID: ${id}`);
      }

      return await this.repository.find({ where: { post: { id }, isActived: true, parentId : 0 } });
    } catch (e) {
      throw new InternalServerErrorException('Error retrieving comments', e.message);
    }
  }

  async findAllOfUser(id: number): Promise<Comment[]> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const user: User | null = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User not found with ID: ${id}`);
      }

      return await this.repository.find({ where: { user: { id } } });
    } catch (e) {
      throw new InternalServerErrorException('Error retrieving comments', e.message);
    }
  }

  async findOne(id: number): Promise<Comment | null> {
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
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const comment: Comment | null = await queryRunner.manager.findOne(Comment, { where: { id } });

      if (!comment) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }

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
      if (!idComment) {
        throw new BadRequestException('Id of comment is required');
      }

      const comment: Comment | null = await this.repository.findOne({ where: { id: idComment } });

      if (!comment) {
        throw new NotFoundException(`Comment not found with id: ${idComment}`);
      }

      if (!idUser) {
        throw new BadRequestException('Id of user is required');
      }

      const user: User | null = await this.userRepository.findOne({ where: { id: idUser } });

      if (!user) {
        throw new NotFoundException(`User not found with id: ${idUser}`);
      }

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
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const comment: Comment | null = await this.repository.findOne({ where: { id } });

      if (!comment) {
        throw new NotFoundException(`Comment not found with ID: ${id}`);
      }

      return await this.repository.find({ where: { parentId : id } });
    } catch (e) {
      throw new InternalServerErrorException('Error retrieving comments', e.message);
    }
  }


}
