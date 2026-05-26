import { ApiProperty } from '@nestjs/swagger';

class TodoCategoryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Work' })
  name: string;
}

export class TodoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Buy milk' })
  text: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ type: TodoCategoryDto })
  category: TodoCategoryDto;
}
