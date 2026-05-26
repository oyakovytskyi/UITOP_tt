import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { MAX_TASKS_PER_CATEGORY } from '../common/constants/todos';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ListTodosQueryDto } from './dto/list-todos-query.dto';
import { TodoResponseDto } from './dto/todo-response.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found.');
    }

    const taskCount = await this.todoRepo.count({
      where: { categoryId: dto.categoryId },
    });

    if (taskCount >= MAX_TASKS_PER_CATEGORY) {
      throw new BadRequestException(
        `Category "${category.name}" already has ${MAX_TASKS_PER_CATEGORY} tasks.`,
      );
    }

    const todo = this.todoRepo.create({
      text: dto.text,
      categoryId: dto.categoryId,
    });

    const saved = await this.todoRepo.save(todo);
    const reloaded = await this.todoRepo.findOne({
      where: { id: saved.id },
      relations: ['category'],
    });

    return this.toResponseDto(reloaded!);
  }

  async findAll(query: ListTodosQueryDto): Promise<TodoResponseDto[]> {
    if (query.category !== undefined) {
      const category = await this.categoryRepo.findOne({
        where: { id: query.category },
      });

      if (!category) {
        return [];
      }
    }

    const todos = await this.todoRepo.find({
      where:
        query.category !== undefined
          ? { categoryId: query.category }
          : undefined,
      relations: ['category'],
      order: { id: 'ASC' },
    });

    return todos.map((todo) => this.toResponseDto(todo));
  }

  async update(id: number, dto: UpdateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.todoRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }

    todo.completed = dto.completed;
    const saved = await this.todoRepo.save(todo);
    return this.toResponseDto(saved);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.todoRepo.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }

    await this.todoRepo.remove(todo);
  }

  private toResponseDto(todo: Todo): TodoResponseDto {
    return {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      category: {
        id: todo.category.id,
        name: todo.category.name,
      },
    };
  }
}
