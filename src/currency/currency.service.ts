import { Currency } from './currency.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CurrencyDto } from './interface/currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) { }

  async save(currencyDto: CurrencyDto): Promise<Currency> {
    //Se vazio ambos campos
    //Se máximo 255 nome
    //Se mínimo e máximo 3 em código
    //Se código já cadastrado 
    //Se código existe
    //Se nome já cadastrado (400)
    //Salvar (201)
    return await this.currencyRepository.save(currencyDto);
  }

  async delete(id: number): Promise<void> {
    //Se id existente (400)
    //Excluir (200)
    await this.currencyRepository.delete(id);
  }

  async convert(codeFrom: string, codeTo: string, amount: number) {
    //Se ambos códigos informados
    //Se ambos códigos existem
    //Se quantia > 0 (400)
    //Obter valor em relação ao real usando api (https://docs.awesomeapi.com.br/api-de-moedas)
    //Converter (200)
  }
}
