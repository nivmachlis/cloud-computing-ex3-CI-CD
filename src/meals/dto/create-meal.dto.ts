import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  appetizer: number;

  @IsNotEmpty()
  @IsNumber()
  main: number;

  @IsNumber()
  @IsNotEmpty()
  dessert: number;
}
