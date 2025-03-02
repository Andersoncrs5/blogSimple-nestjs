import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ){}

  async create(id:number, createCategoryDto: CreateCategoryDto) {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      if (!id) {
        throw new BadRequestException('Id is required');
      }

      const user: User | null = await queryRunner.manager.findOne(User, { where : { id } });

      if(user == null) {
        throw new NotFoundException('User not found')
      }


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

  async findOne(id: number): Promise<Category | null> {
    try {
      if (!id) {
        throw new BadRequestException('Id is required');
      }
      const category: Category | null = await this.repository.findOne({ where : { id } });

      return category;
    } catch (e) {
      throw e
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      if (!id) {
        throw new BadRequestException('');
      }

      const category: Category | null = await queryRunner.manager.findOne(Category, { where: { id } });

      if ( category == null ){
        throw new NotFoundException('Category not found with id: '+id)
      }

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
      if (!id) {
        throw new BadRequestException('');
      }

      const category: Category | null = await queryRunner.manager.findOne(Category, { where: { id } });

      if ( category == null ){
        throw new NotFoundException('Category not found with id: '+id)
      }

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
      if (!id) {
        throw new BadRequestException('Id is required');
      }

      const category: Category | null = await queryRunner.manager.findOne(Category, { where: { id } });

      if ( category == null ){
        throw new NotFoundException('Category not found with id: '+id)
      }

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
