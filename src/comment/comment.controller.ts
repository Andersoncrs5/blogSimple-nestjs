import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
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
  async create(@Param('idPost') idPost: number, @Req() req, @Body() createCommentDto: CreateCommentDto) {
    return await this.service.create(idPost, +req.user.id, createCommentDto);
  }

  @Get('findAllOfPost/:id')
  async findAllOfPost(@Param('id') id: number) {
    return await this.service.findAllOfPost(id);
  }

  @Get('/findAllofUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllOfUser(@Req() req) {
    return this.service.findAllOfUser(+req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return await this.service.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @Post('/createOnComment/:idComment/')
  async createOnComment(@Param('idComment') idComment: number, @Req() req, @Body() createCommentDto: CreateCommentDto) {
    return await this.service.createOnComment(idComment, +req.user.sub, createCommentDto);
  }

  @Get('/findAllOfComment/:id')
  async findAllOfComment(@Param('id') id: string) {
    return await this.service.findAllOfComment(+id);
  }
  

}
