import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { CurrencyModule } from './currency/currency.module';
import { Currency } from './currency/currency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Currency]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          name: configService.getEnvConfig().DB_CONNECTION_NAME
        } as TypeOrmModuleOptions;
      },
    }),
    CurrencyModule,
  ],
})
export class AppModule {
}