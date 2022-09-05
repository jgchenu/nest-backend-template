import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './cat.entity';

export type CatListData = {
  list: CatEntity[];
  count: number;
};

export type QueryParams = {
  pageNum?: number;
  pageSize?: number;
};

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
  ) {}

  // 创建文章
  async create(post: Partial<CatEntity>): Promise<CatEntity> {
    const { name } = post;
    if (!name) {
      throw new HttpException('缺少猫的名称', 401);
    }
    const doc = await this.catRepository.findOne({ where: { name } });
    if (doc) {
      throw new HttpException('该猫已存在', 401);
    }
    return await this.catRepository.save(post);
  }

  // 获取文章列表
  async findAll(query) {
    const qb = await this.catRepository.createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10 } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id) {
    return await this.catRepository.findOne(id);
  }

  // 更新文章
  async updateById(id, post) {
    const existPost = await this.catRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的猫不存在`, 401);
    }
    const updatePost = this.catRepository.merge(existPost, post);
    return this.catRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id) {
    const existPost = await this.catRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的猫不存在`, 401);
    }
    return await this.catRepository.remove(existPost);
  }
}
