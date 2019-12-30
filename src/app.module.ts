import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { CurrencyModule } from './currency/currency.module';
import { Currency } from './currency/currency.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          name: configService.getEnvConfig().DB_NAME,
          database: configService.getEnvConfig().DB,
          type: configService.getEnvConfig().DB_TYPE,
          host: configService.getEnvConfig().DB_HOST,
          port: configService.getEnvConfig().DB_PORT,
          username: configService.getEnvConfig().DB_USERNAME,
          password: configService.getEnvConfig().DB_PASSWORD,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migration/*.{.ts,.js}'],
        } as TypeOrmModuleOptions;
      },
    }),
    CurrencyModule,
  ],
})
export class AppModule {
}