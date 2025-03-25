import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private readonly userService : UserService,
  ){}

  async create(id:number, createCategoryDto: CreateCategoryDto) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const user: User = await this.userService.findOne(id);

      const categoryCreate = { ...createCategoryDto, user }
      categoryCreate.nameUser = user.name
      const category: Category = await queryRunner.manager.create(Category, categoryCreate);

      await queryRunner.manager.save(category);
      await queryRunner.commitTransaction();

      return category;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.repository.find({ where : { isActived: true } })
    } catch (e) {
      throw e
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }
      const category: Category | null = await this.repository.findOne({ where : { id } });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (e) {
      throw e
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const category: Category = await this.findOne(id);

      await queryRunner.manager.update(Category, id, updateCategoryDto)
      
      await queryRunner.commitTransaction();

      return await queryRunner.manager.findOne(Category, { where: { id } } ) ;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const category: Category = await this.findOne(id);

      await queryRunner.manager.delete(Category, id)
      await queryRunner.commitTransaction();

      return await 'Category deleted';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async ChangeStatusActive(id: number): Promise<Category> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const category: Category = await this.findOne(id);
      category.isActived  = !category.isActived

      await queryRunner.manager.update(Category, id, category)
      await queryRunner.commitTransaction();

      return category;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}