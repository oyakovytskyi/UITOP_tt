import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Todos (e2e)', () => {
  let app: INestApplication<App>;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = mkdtempSync(join(tmpdir(), 'uitop-todos-'));
    process.env.DATABASE_PATH = join(tempDir, 'test.sqlite');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('POST /todos creates a todo', async () => {
    const response = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Buy milk', categoryId: 1 })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      text: 'Buy milk',
      completed: false,
      category: { id: 1, name: 'Work' },
    });
  });

  it('GET /todos returns all todos', async () => {
    await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Task one', categoryId: 1 });

    const response = await request(app.getHttpServer()).get('/todos').expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].text).toBe('Task one');
  });

  it('GET /todos?category=1 filters by category', async () => {
    await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Work task', categoryId: 1 });
    await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Personal task', categoryId: 2 });

    const response = await request(app.getHttpServer())
      .get('/todos?category=1')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].text).toBe('Work task');
  });

  it('GET /todos?category=99 returns empty array for unknown category', async () => {
    const response = await request(app.getHttpServer())
      .get('/todos?category=99')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('PATCH /todos/:id updates completed status', async () => {
    const created = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Toggle me', categoryId: 1 });

    const response = await request(app.getHttpServer())
      .patch(`/todos/${created.body.id}`)
      .send({ completed: true })
      .expect(200);

    expect(response.body.completed).toBe(true);
  });

  it('DELETE /todos/:id removes a todo', async () => {
    const created = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Delete me', categoryId: 1 });

    await request(app.getHttpServer())
      .delete(`/todos/${created.body.id}`)
      .expect(204);

    const list = await request(app.getHttpServer()).get('/todos').expect(200);
    expect(list.body).toHaveLength(0);
  });

  it('POST /todos returns 400 when category has 5 tasks', async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app.getHttpServer())
        .post('/todos')
        .send({ text: `Task ${i}`, categoryId: 1 })
        .expect(201);
    }

    const response = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Task 6', categoryId: 1 })
      .expect(400);

    expect(response.body.message).toBe(
      'Category "Work" already has 5 tasks.',
    );
  });

  it('POST /todos returns 400 for unknown category', async () => {
    const response = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Orphan task', categoryId: 99 })
      .expect(400);

    expect(response.body.message).toBe('Category not found.');
  });

  it('POST /todos returns 400 for empty text', async () => {
    const response = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: '', categoryId: 1 })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('PATCH /todos/:id returns 404 for non-existent todo', async () => {
    const response = await request(app.getHttpServer())
      .patch('/todos/9999')
      .send({ completed: true })
      .expect(404);

    expect(response.body.message).toBe('Todo not found.');
  });

  it('DELETE /todos/:id returns 404 for non-existent todo', async () => {
    const response = await request(app.getHttpServer())
      .delete('/todos/9999')
      .expect(404);

    expect(response.body.message).toBe('Todo not found.');
  });

  it('PATCH /todos/:id returns 400 for invalid id', async () => {
    const response = await request(app.getHttpServer())
      .patch('/todos/abc')
      .send({ completed: true })
      .expect(400);

    expect(response.body.message).toContain('numeric string is expected');
  });

  it('PATCH /todos/:id returns 400 when completed is missing', async () => {
    const created = await request(app.getHttpServer())
      .post('/todos')
      .send({ text: 'Invalid patch', categoryId: 1 });

    const response = await request(app.getHttpServer())
      .patch(`/todos/${created.body.id}`)
      .send({})
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
