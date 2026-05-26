import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CATEGORY_NAMES } from '../common/constants/categories';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      await this.categoryRepo.save(
        CATEGORY_NAMES.map((name) => this.categoryRepo.create({ name })),
      );
    }
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepo.find({
      order: { id: 'ASC' },
    });

    return categories.map(({ id, name }) => ({ id, name }));
  }
}
