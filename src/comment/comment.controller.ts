import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post(':idPost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('idPost') idPost: number, @Req() req, @Body() createCommentDto: CreateCommentDto) {
    return await this.service.create(idPost, +req.user.id, createCommentDto);
  }

  @Get('findAllOfPost/:id')
  @HttpCode(HttpStatus.FOUND)
  async findAllOfPost(@Param('id') id: number) {
    return await this.service.findAllOfPost(id);
  }

  @Get('/findAllofUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.FOUND)
  async findAllOfUser(@Req() req) {
    return this.service.findAllOfUser(+req.user.sub);
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return await this.service.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @Post('/createOnComment/:idComment/')
  @HttpCode(HttpStatus.CREATED)
  async createOnComment(@Param('idComment') idComment: number, @Req() req, @Body() createCommentDto: CreateCommentDto) {
    return await this.service.createOnComment(idComment, +req.user.sub, createCommentDto);
  }

  @Get('/findAllOfComment/:id')
  @HttpCode(HttpStatus.FOUND)
  async findAllOfComment(@Param('id') id: string) {
    return await this.service.findAllOfComment(+id);
  }
  

}
