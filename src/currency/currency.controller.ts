import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';

@Controller()
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findAll(): Promise<Currency[]> {
    return await this.currencyService.findAll();
  }
}
