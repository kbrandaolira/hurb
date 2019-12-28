import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.getEnvConfig().DB_TYPE,
          host: configService.getEnvConfig().DB_HOST,
          port: configService.getEnvConfig().DB_PORT,
          username: configService.getEnvConfig().DB_USERNAME,
          password: configService.getEnvConfig().DB_PASSWORD,
          database: configService.getEnvConfig().DB_NAME,
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