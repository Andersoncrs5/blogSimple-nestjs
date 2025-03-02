import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CryptoService } from 'CryptoService';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const user: User = queryRunner.manager.create(User, createUserDto);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      if(!id) {
        throw new BadRequestException('Id is required');
      }

      const user: User | null = await this.repository.findOne({ where: { id } });

      if (user == null){
        throw new NotFoundException('User not found');
      }
      
      return user
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      const user: User | null = await queryRunner.manager.findOne(User, { where: { id } });

      if (user == null) {
        throw new NotFoundException('User not found with id: ' + id);
      }

      if(!updateUserDto.password){
        throw new BadRequestException('Password is required')
      }

      updateUserDto.password = await CryptoService.encrypt(updateUserDto.password);
      await queryRunner.manager.update(User, id, updateUserDto);
      await queryRunner.commitTransaction();

      const userUpdated: User | null = await queryRunner.manager.findOne(User, { where: { id }});

      return userUpdated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<string> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new BadRequestException('ID must be a positive number');
      }

      const user: User | null = await queryRunner.manager.findOne(User, { where: { id } });

      if (user == null) {
        throw new NotFoundException('User not found with id: ' + id);
      }

      await queryRunner.manager.delete(User, id);
      await queryRunner.commitTransaction();

      return 'User deleted with id : ' + id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async LoginAsync(userDto: LoginUserDTO): Promise<boolean> {
    try {
      const email = userDto.email;
      const foundUser = await this.repository.findOne({ where: { email } });
  
      if (!foundUser) {
        return false;
      }
  
      const isPasswordCorrect = await CryptoService.compare(userDto.password, foundUser.password);
  
      if (!isPasswordCorrect) {
        return false;
      }
  
      return true;
    } catch (error) {
      throw error;
    }
  } 

}
