import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ListTodosQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Filter by category id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  category?: number;
}
