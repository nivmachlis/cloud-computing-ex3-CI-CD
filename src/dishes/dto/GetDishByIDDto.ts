import { IsString, IsInt } from 'class-validator';

export class GetDishByIDDto {
  @IsInt()
  id: number;
}
