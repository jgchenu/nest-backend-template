import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './cat.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('猫猫')
@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @ApiOperation({ summary: '获取所有猫猫' })
  @Get()
  getCats() {
    return this.catService.findAll({});
  }

  @ApiOperation({ summary: '新增一只猫猫' })
  @Post()
  createCat(@Body() post: CreateCatDto) {
    return this.catService.create(post);
  }
}
