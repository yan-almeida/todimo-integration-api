import { Product } from '@app/dummy/interfaces/product.interface';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';

const URL_PATTERN = 'products';

@Injectable()
export class DummyProductClient {
  private readonly logger = new Logger(DummyProductClient.name);

  constructor(private readonly httpService: HttpService) {}

  async getSingleProduct(productId: number): Promise<Product> {
    const { baseUrlRequest } = this.internalConfigs;

    this.logger.debug(
      `Parâmetro utilizado na buscar - [productId][${JSON.stringify(
        productId,
      )}] - [method][${this.getSingleProduct.name}]`,
    );

    return lastValueFrom(
      this.httpService.get<Product>(`${baseUrlRequest}/${productId}`).pipe(
        catchError((error) => {
          this.logger.error(error);

          const { status } = error.response;
          const { message } = error.response.data;

          throw new HttpException(message, status);
        }),
        map((response) => response.data),
      ),
    );
  }

  async addNewProduct(data: Partial<Omit<Product, 'id'>>) {
    const { addProductUrl } = this.internalConfigs;

    this.logger.debug(
      `Parâmetro utilizado na buscar - [product][${JSON.stringify(
        data,
      )}] - [method][${this.addNewProduct.name}]`,
    );

    return lastValueFrom(
      this.httpService.post<Product>(addProductUrl, data).pipe(
        catchError((error) => {
          this.logger.error(error);

          const { status } = error.response;
          const { message } = error.response.data;

          throw new HttpException(message, status);
        }),
        map((response) => response.data),
      ),
    );
  }

  private get internalConfigs() {
    const baseUrlRequest = `/${URL_PATTERN}`;
    const addProductUrl = `/${URL_PATTERN}/add`;

    return {
      baseUrlRequest,
      addProductUrl,
    };
  }
}
