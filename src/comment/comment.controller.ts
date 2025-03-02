import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':idPost/:idUser')
  async create(@Param('idPost') idPost: number, @Param('idUser') idUser: number, @Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(idPost, idUser, createCommentDto);
  }

  @Get('findAllOfPost/:id')
  async findAllOfPost(@Param('id') id: number) {
    return await this.commentService.findAllOfPost(id);
  }

  @Get('findAllOfUser/:id')
  async findAllOfUser(@Param('id') id: number) {
    return await this.commentService.findAllOfUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return await this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentService.remove(+id);
  }

  @Post('/createOnComment/:idComment/:idUser')
  async createOnComment(@Param('idComment') idComment: number, @Param('idUser') idUser: number, @Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.createOnComment(idComment, idUser, createCommentDto);
  }

  @Get('/findAllOfComment/:id')
  async findAllOfComment(@Param('id') id: string) {
    return await this.commentService.findAllOfComment(+id);
  }
  

}
