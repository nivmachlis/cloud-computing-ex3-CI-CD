import { IsString, IsInt } from 'class-validator';

export class CreateDishDto {
  @IsString()
  name: string;
  @IsInt()
  id: number;
  @IsInt()
  cal: number;
  @IsInt()
  size: number;
  @IsInt()
  sodium: number;
  @IsInt()
  sugar: number;
}
