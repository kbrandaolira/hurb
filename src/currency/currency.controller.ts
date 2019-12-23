import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';
import { CurrencyDto } from './dto/currency.dto';

@Controller('/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) { }

  @Post()
  async save(@Body() currencyDto: CurrencyDto): Promise<Currency> {
    return await this.currencyService.save(currencyDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.currencyService.delete(id);
  }

}
