import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  appetizer: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  main: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  dessert: number;
}
