import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [TypeOrmModule.forRoot(), CurrencyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
