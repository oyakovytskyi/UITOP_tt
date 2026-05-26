import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ListTodosQueryDto } from './dto/list-todos-query.dto';
import { TodoResponseDto } from './dto/todo-response.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Post()
  @ApiOperation({ summary: 'Create a todo' })
  @ApiResponse({ status: 201, type: TodoResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Validation error, unknown category, or category task limit reached',
    schema: {
      example: {
        statusCode: 400,
        message: 'Category "Work" already has 5 tasks.',
        error: 'Bad Request',
      },
    },
  })
  create(@Body() dto: CreateTodoDto): Promise<TodoResponseDto> {
    return this.todosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List todos, optionally filtered by category' })
  @ApiResponse({ status: 200, type: [TodoResponseDto] })
  @ApiResponse({
    status: 400,
    description: 'Invalid category query parameter',
    schema: {
      example: {
        statusCode: 400,
        message: ['category must not be less than 1', 'category must be an integer number'],
        error: 'Bad Request',
      },
    },
  })
  findAll(@Query() query: ListTodosQueryDto): Promise<TodoResponseDto[]> {
    return this.todosService.findAll(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo completed status' })
  @ApiResponse({ status: 200, type: TodoResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid id or request body',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Todo not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Todo not found.',
        error: 'Not Found',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    return this.todosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 204, description: 'Todo deleted' })
  @ApiResponse({
    status: 400,
    description: 'Invalid id',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Todo not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Todo not found.',
        error: 'Not Found',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todosService.remove(id);
  }
}
