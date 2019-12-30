import { Currency } from './currency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CurrencyDto } from './dto/currency.dto';
import { Validator } from 'class-validator';
import { ExchangeAPI } from '../exchange/exchange.api';
import { ExchangeDto } from '../exchange/dto/exchange.dto';

@Injectable()
export class CurrencyService {

  private readonly exchangeApi: ExchangeAPI = new ExchangeAPI();

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) { }

  async findByName(name: string): Promise<Currency> {
    return await this.currencyRepository.findOne({ name })
  }

  async findByCode(code: string): Promise<Currency> {
    return await this.currencyRepository.findOne({ code })
  }

  async findById(id: number): Promise<Currency> {
    return await this.currencyRepository.findOne({ id })
  }

  async find(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  async save(dto: CurrencyDto): Promise<Currency> {
    const validator = new Validator();

    if (!validator.length(dto.code, 3, 3)) {
      throw new BadRequestException('code size must be 3')
    }

    if (await this.findByCode(dto.code)) {
      throw new BadRequestException('code already exists')
    }

    if (!validator.length(dto.name, 1, 255)) {
      throw new BadRequestException('name size must be between 1 and 255')
    }

    if (await this.findByName(dto.name)) {
      throw new BadRequestException('name already exists')
    }

    if (!await this.exchangeApi.isValidCode(dto.code) && dto.code !== this.exchangeApi.getBaseCurrency()) {
      throw new BadRequestException('invalid code')
    }

    return await this.currencyRepository.save(dto);
  }

  async delete(id: number): Promise<void> {
    if (await this.findById(id)) {
      await this.currencyRepository.delete(id);
    } else {
      throw new NotFoundException();
    }

  }

  async convert(codeFrom: string, codeTo: string, amount: number): Promise<ExchangeDto> {
    if (!(amount > 0)) {
      throw new BadRequestException('amount must be higher than zero');
    }

    if (!await this.findByCode(codeFrom)) {
      throw new BadRequestException(`code ${codeFrom} does not exist`)
    }

    if (!await this.findByCode(codeTo)) {
      throw new BadRequestException(`code ${codeTo} does not exist`)
    }

    return await this.exchangeApi.quote(codeFrom, codeTo, amount);
  }
}
