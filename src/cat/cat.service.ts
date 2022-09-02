import { Injectable } from '@nestjs/common';

@Injectable()
export class CatService {
  getCat() {
    return 'this is a cat';
  }
}
