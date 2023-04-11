import { IsString, IsNotEmpty } from 'class-validator';

export class GetDishByNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
