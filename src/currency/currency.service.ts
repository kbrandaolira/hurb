import { Currency } from './currency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CurrencyDto } from './dto/currency.dto';
import { Validator } from 'class-validator';

@Injectable()
export class CurrencyService {
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

    //Se código existe na API
    return await this.currencyRepository.save(dto);
  }

  async delete(id: number): Promise<void> {
    if (await this.findById(id)) {
      await this.currencyRepository.delete(id);
    } else {
      throw new NotFoundException();
    }

  }

  async convert(codeFrom: string, codeTo: string, amount: number) {
    //Se ambos códigos informados
    //Se ambos códigos existem
    //Se quantia > 0 (400)
    //Obter valor em relação ao real usando api (https://docs.awesomeapi.com.br/api-de-moedas)
    //Converter (200)
  }
}
