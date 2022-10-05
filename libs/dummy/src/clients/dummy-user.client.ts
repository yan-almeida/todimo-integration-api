import { User } from '@app/dummy/interfaces';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';

const URL_PATTERN = 'users';

@Injectable()
export class DummyUserClient {
  private readonly logger = new Logger(DummyUserClient.name);

  constructor(private readonly httpService: HttpService) {}

  async getSingleUser(userId: number): Promise<User> {
    const { urlRequest } = this.internalConfigs;

    this.logger.debug(
      `Parâmetro utilizado na buscar - [userId][${JSON.stringify(
        userId,
      )}] - [method][${this.getSingleUser.name}]`,
    );

    return lastValueFrom(
      this.httpService.get<User>(`${urlRequest}/${userId}`).pipe(
        catchError((error) => {
          this.logger.error(error);

          // {
          // "statusCode": 409,
          // "message": "Já existe um pedido cadastrado com o código 1422.",
          // "error": "Conflict"
          // }

          const { status } = error.response;
          const { message } = error.response.data;

          throw new HttpException(message, status);
        }),
        map((response) => response.data),
      ),
    );
  }

  private get internalConfigs() {
    const urlRequest = `/${URL_PATTERN}`;

    return { urlRequest };
  }
}
