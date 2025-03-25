import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { AdmService } from './adm.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('adm')
export class AdmController {
  constructor(private readonly admService: AdmService) {}

  @Get('getAllCommentBlockeds')
  @HttpCode(HttpStatus.FOUND)
  @ApiBearerAuth()
  async getAllCommentBlockeds() {
    return await this.admService.getAllCommentBlockeds();
  }

  @Get('getAllPostBlockeds')
  @HttpCode(HttpStatus.FOUND)
  @ApiBearerAuth()
  async getAllPostBlockeds() {
    return await this.admService.getAllPostBlockeds();
  }

  @HttpCode(HttpStatus.FOUND)
  @Get('getAllUserBlockeds')
  @ApiBearerAuth()
  async getAllUserBlockeds() {
    return await this.admService.getAllUserBlockeds();
  }

  @HttpCode(HttpStatus.OK)
  @Get('blockOrUnblockUser/:id')
  @ApiBearerAuth()
  async blockOrUnblockUser(@Param('id') id: string ) {
    return await this.admService.blockOrUnblockUser(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('blockOrUnblockPost/:id')
  @ApiBearerAuth()
  async blockOrUnblockPost(@Param('id') id: string ) {
    return await this.admService.blockOrUnblockPost(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('blockOrUnblockComment/:id')
  @ApiBearerAuth()
  async blockOrUnblockComment(@Param('id') id: string ) {
    return await this.admService.blockOrUnblockComment(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('turnUserInAdm/:id')
  @ApiBearerAuth()
  async turnUserInAdm(@Param('id') id: string ) {
    return await this.admService.turnUserInAdm(+id);
  }

}
