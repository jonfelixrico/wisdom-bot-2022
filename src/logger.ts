import { WinstonModule, utilities } from 'nest-winston'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

export const WINSTON_LOGGER = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'isoDateTime',
        }),
        winston.format.ms(),
        utilities.format.nestLike('MyApp', {
          colors: true,
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/nest-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})
