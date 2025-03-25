import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    private readonly userService: UserService,
  ){}
  async create(id: number,createPostDto: CreatePostDto): Promise<Post> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const user: User = await this.userService.findOne(id);

      const postData = {...createPostDto, user}
      const post: Post = await queryRunner.manager.create(Post, postData);

      const postCreated: Post = await queryRunner.manager.save(post);
      await queryRunner.commitTransaction();
      return postCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Post[]> {
    try {
      return await this.repository.find({ where: { isActived: true } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  
  async findAllOfUser(id: number): Promise<Post[]> {
    try {
      const user: User = await this.userService.findOne(id);

      const posts: Post[] = await this.repository.find({ where: { user: { id } } });

      return posts
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number): Promise<Post> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const post: Post | null = await this.repository.findOne({ where: { id } });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const postExists: Post = await this.findOne(id);

      await queryRunner.manager.update(Post, id, updatePostDto);

      const postUpdated: Post | null = await queryRunner.manager.findOne(Post, { where: { id } })
      await queryRunner.commitTransaction();

      return postUpdated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<string> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const post: Post = await this.findOne(id);

      await queryRunner.manager.delete(Post, id);
      await queryRunner.commitTransaction();
      return 'Post deleted';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findByTitle(title: string): Promise<Post[]> {
    try {
      if (!title || title.length === 0) {
        throw new BadRequestException('Title is required');
      }
  
      return await this.repository.find({
        where: { title: Like(`%${title}%`) },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findByCategory(category: string): Promise<Post[]> {
    try {
      if (!category || category.length === 0) {
        throw new BadRequestException('Category is required');
      }

      return  await this.repository.find({ where: { category } })
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

}