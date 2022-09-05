import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatCreateBody } from './cat.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}
  @Get()
  getCats() {
    return this.catService.findAll({});
  }

  @Post()
  createCat(@Body() post: CatCreateBody) {
    return this.catService.create(post);
  }
}
