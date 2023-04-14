import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
