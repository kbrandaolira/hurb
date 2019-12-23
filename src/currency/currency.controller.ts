import { Controller, Get, Post, Body, Delete, Param, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';
import { CurrencyDto } from './dto/currency.dto';
import { ExchangeDto } from '../exchange/dto/exchange.dto';

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

  @Get('/convert')
  async convert(@Query() query): Promise<ExchangeDto> {
    return await this.currencyService.convert(query.codeFrom, query.codeTo, query.amount);
  }

}
