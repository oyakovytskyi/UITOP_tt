import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  completed: boolean;
}
