import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoritePostDto } from './dto/create-favorite_post.dto';
import { Repository } from 'typeorm';
import { FavoritePost } from './entities/favorite_post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class FavoritePostService {
  constructor(
    @InjectRepository(FavoritePost)
    private readonly repository: Repository<FavoritePost>,
    private readonly userService : UserService,
    private readonly postService : PostService,
  ) {}

  async create(createFavoritePostDto: CreateFavoritePostDto): Promise<FavoritePost> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findOne(createFavoritePostDto.userId);
      const post = await this.postService.findOne(createFavoritePostDto.postId);

      const existingFavorite = await this.repository.findOne({ where: { user: { id: user.id }, post: { id: post.id } } });
      if (existingFavorite) throw new BadRequestException('This post is already in favorites');

      const favoritePostCreate = queryRunner.manager.create(FavoritePost, { user, post });

      const created = await queryRunner.manager.save(favoritePostCreate);
      await queryRunner.commitTransaction();
      return created;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOfUser(id: number): Promise<FavoritePost[]> {
    const user = await this.userService.findOne(id);
    return this.repository.find({ where: { user: { id } }, relations: ['post'] });
  }

  async exists(idUser: number, idPost: number): Promise<boolean> {
    if (!idUser || isNaN(idUser) || idUser <= 0) {
      throw new BadRequestException('ID of user must be a positive number');
    }

    if (!idPost || isNaN(idPost) || idPost <= 0) {
      throw new BadRequestException('ID of post must be a positive number');
    }

    const count = await this.repository.count({ where: { user: { id: idUser }, post: { id: idPost } } });
    return count > 0;
  }

  async remove(id: number): Promise<string> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const favoritePost = await queryRunner.manager.findOne(FavoritePost, { where: { id } });
      if (!favoritePost) throw new NotFoundException(`Favorite post not found with id: ${id}`);

      await queryRunner.manager.delete(FavoritePost, id);
      await queryRunner.commitTransaction();

      return `Favorite post deleted with id: ${id}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
