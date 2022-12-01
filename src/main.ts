import { NestFactory } from '@nestjs/core'
import { WinstonModule, utilities } from 'nest-winston'
import * as winston from 'winston'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
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
    }),
  })
  await app.listen(3000)
}
bootstrap()
