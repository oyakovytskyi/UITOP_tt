import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { MAX_TASKS_PER_CATEGORY } from '../common/constants/todos';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;
  let todoRepo: jest.Mocked<Repository<Todo>>;
  let categoryRepo: jest.Mocked<Repository<Category>>;

  const workCategory: Category = { id: 1, name: 'Work' };

  const savedTodo: Todo = {
    id: 1,
    text: 'Buy milk',
    completed: false,
    categoryId: 1,
    category: workCategory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TodosService);
    todoRepo = module.get(getRepositoryToken(Todo));
    categoryRepo = module.get(getRepositoryToken(Category));
  });

  describe('create', () => {
    it('creates a todo when category exists and limit not reached', async () => {
      categoryRepo.findOne.mockResolvedValue(workCategory);
      todoRepo.count.mockResolvedValue(0);
      todoRepo.create.mockReturnValue(savedTodo);
      todoRepo.save.mockResolvedValue(savedTodo);
      todoRepo.findOne.mockResolvedValue(savedTodo);

      const result = await service.create({ text: 'Buy milk', categoryId: 1 });

      expect(result).toEqual({
        id: 1,
        text: 'Buy milk',
        completed: false,
        category: { id: 1, name: 'Work' },
      });
    });

    it('throws BadRequestException when category not found', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ text: 'Buy milk', categoryId: 99 }),
      ).rejects.toThrow(new BadRequestException('Category not found.'));
    });

    it('throws BadRequestException when category has max tasks', async () => {
      categoryRepo.findOne.mockResolvedValue(workCategory);
      todoRepo.count.mockResolvedValue(MAX_TASKS_PER_CATEGORY);

      await expect(
        service.create({ text: 'Buy milk', categoryId: 1 }),
      ).rejects.toThrow(
        new BadRequestException(
          `Category "Work" already has ${MAX_TASKS_PER_CATEGORY} tasks.`,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('returns empty array when filtering by unknown category', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      const result = await service.findAll({ category: 99 });

      expect(result).toEqual([]);
      expect(todoRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('returns todos filtered by category', async () => {
      categoryRepo.findOne.mockResolvedValue(workCategory);
      const queryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([savedTodo]),
      };
      todoRepo.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder) as typeof todoRepo.createQueryBuilder;

      const result = await service.findAll({ category: 1 });

      expect(todoRepo.createQueryBuilder).toHaveBeenCalledWith('todo');
      expect(queryBuilder.innerJoinAndSelect).toHaveBeenCalledWith(
        'todo.category',
        'category',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'todo.categoryId = :categoryId',
        { categoryId: 1 },
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('updates todo completed status', async () => {
      const updatedTodo = { ...savedTodo, completed: true };
      todoRepo.findOne
        .mockResolvedValueOnce({ ...savedTodo })
        .mockResolvedValueOnce(updatedTodo);
      todoRepo.save.mockResolvedValue(updatedTodo);

      const result = await service.update(1, { completed: true });

      expect(result.completed).toBe(true);
    });

    it('throws NotFoundException when todo not found', async () => {
      todoRepo.findOne.mockResolvedValue(null);

      await expect(service.update(99, { completed: true })).rejects.toThrow(
        new NotFoundException('Todo not found.'),
      );
    });
  });

  describe('remove', () => {
    it('removes an existing todo', async () => {
      todoRepo.findOne.mockResolvedValue(savedTodo);
      todoRepo.remove.mockResolvedValue(savedTodo);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(jest.mocked(todoRepo.remove)).toHaveBeenCalledWith(savedTodo);
    });

    it('throws NotFoundException when todo not found', async () => {
      todoRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(
        new NotFoundException('Todo not found.'),
      );
    });
  });
});
