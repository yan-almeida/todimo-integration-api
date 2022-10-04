import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class InfraLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('@interceptor/infra');
  private readonly applicationName: string;
  private readonly enabled: boolean;

  /**
   *
   * @param configs Dependency injection of the InfraConfig.
   * Check config/infra-interceptor.config.ts to add another env variable
   */
  constructor(private readonly configService: ConfigService) {
    this.applicationName = this.configService.get<string>(
      'infraLogs.applicationName',
    );
    this.enabled = this.configService.get<boolean>('infraLogs.enable');
  }

  private logTime(timeStart: number, className: string, methodKey: string) {
    this.logger.log(
      `application=${
        this.applicationName
      } class=${className} method=${methodKey} req_time=${
        Date.now() - timeStart
      }ms`,
    );
  }

  private log5xx(err: any, className: string, methodKey: string) {
    if (err.status >= 500 && err.status < 600) {
      this.logger.log(
        `application=${
          this.applicationName
        } class=${className} method=${methodKey} err_5xx=${
          err.response.message ??
          err.response.body?.message ??
          'Mensagem não informada.'
        }`,
      );
    }
    if (err.status >= 400 && err.status < 500) {
      this.logger.log(
        `application=${
          this.applicationName
        } class=${className} method=${methodKey} err_5xx=${
          err.response.message ??
          err.response.body?.message ??
          'Mensagem não informada.'
        }`,
      );
    }
  }

  /**
   * How to use: add logic to function "complete" to make a log.
   * It is best create a private method with your logic and call it there.
   *
   * this method is called after an endpoint returns successfully
   *
   */
  private afterComplete(startReqTime: number, context: ExecutionContext) {
    const className = context.getClass().name; // name of the controller class
    const methodKey = context.getHandler().name; // name of the method used

    const complete = () => {
      this.logTime(startReqTime, className, methodKey);
    };

    return tap({
      complete,
    });
  }

  /**
   * How to use: add logic to the callback function of "catchError" to make a log.
   * It is best create a private method with your logic and call it there.
   *
   * this method is called after an endpoint throws an error
   *
   */
  private afterError(startReqTime: number, context: ExecutionContext) {
    const className = context.getClass().name; // name of the controller class
    const methodKey = context.getHandler().name; // name of the method used

    return catchError((err) => {
      this.log5xx(err, className, methodKey);
      this.logTime(startReqTime, className, methodKey);

      throw err;
    });
  }

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const startReqTime = Date.now();

    return this.enabled
      ? next
          .handle()
          .pipe(this.afterComplete(startReqTime, executionContext))
          .pipe(this.afterError(startReqTime, executionContext))
      : next.handle();
  }
}
