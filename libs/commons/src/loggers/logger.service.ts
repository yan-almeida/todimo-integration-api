import { LoggerService } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

/**
 * @class classe responsável por sobrepor os logs nativos do NestJS.
 */
export class WinstonLogger {
  private static IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';

  /**
   * Método responsável por configurar o logger - utilizando a lib {@link WinstonModule https://www.npmjs.com/package/nest-winston}.
   *
   * @param appName - Nome do aplicativo.
   * @returns `LoggerService` - Instância do logger.
   */
  static service(appName = '@app'): LoggerService {
    return WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'silly', // all levels and colors!
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            WinstonLogger.formatter(appName),
          ),
        }),
        new DailyRotateFile({
          dirname: './logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxFiles: '14d',
          format: WinstonLogger.formatter(appName),
        }),
      ],
    });
  }

  /**
   *  Método responsável por retornar o log formatado para desenvolvimento ou produção.
   * @param appName - Nome do aplicativo.
   * @returns log formatado.
   */
  private static formatter(appName: string): winston.Logform.Format {
    const formatedLogger = utilities.format.nestLike(appName, {
      prettyPrint: true,
    });

    if (!WinstonLogger.IS_PRODUCTION) {
      return formatedLogger;
    }

    return winston.format.combine(formatedLogger, winston.format.uncolorize());
  }
}
