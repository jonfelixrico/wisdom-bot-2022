import { WinstonModule, utilities } from 'nest-winston'
import * as winston from 'winston'

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
  ],
})
