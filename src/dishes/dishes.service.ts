import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DishesService {
  headers: object;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const headers = {
      'X-Api-Key': this.configService.get('NINJA_API_KEY'),
    };
    this.headers = headers;
  }

  async getDish(name: string) {
    try {
      const ninjaUrl = this.configService.get('NINJAS_URL');
      const { data } = await firstValueFrom(
        this.httpService.get(`${ninjaUrl}?query=${name}`, {
          headers: this.headers,
        }),
      );
      return data;
    } catch (error) {}
  }
}
