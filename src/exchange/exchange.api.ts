import axios from 'axios';
import { ExchangeDto } from './dto/exchange.dto';

// we consume from https://economia.awesomeapi.com.br 

export class ExchangeAPI {

    private readonly baseCurency: string = 'BRL';
    private readonly url: string = 'https://economia.awesomeapi.com.br';

    // our base currency is BRL

    getBaseCurrency(): string {
        return this.baseCurency;
    }

    /* we quote 1 real (BRL), our base currency, to another currency 
    example: 1 real equal 4 dollars */

    private async baseQuote(code: string): Promise<ExchangeDto> {
        const data = await axios.get(`${this.url}/${code}-${this.baseCurency}/1`).then(response => {
            return response.data;
        });

        if (data.length > 0) {
            return {
                codeFrom: data[0].codein,
                codeTo: data[0].code,
                amountFrom: 1,
                amountTo: data[0].ask
            };
        } else {
            return null;
        }
    }

    // if code exists in external api

    async isValidCode(code: string): Promise<boolean> {
        return await this.baseQuote(code) !== null;
    }

    // we do the logic to quote between two currencies

    async quote(codeFrom: string, codeTo: string, amount: number): Promise<ExchangeDto> {
        const dto = new ExchangeDto();
        dto.codeFrom = codeFrom;
        dto.codeTo = codeTo;
        dto.amountFrom = amount;

        if (codeFrom === codeTo) {
            dto.amountTo = amount;
        } else if (codeFrom === this.getBaseCurrency()) {
            const quote = await this.baseQuote(codeTo);
            dto.amountTo = amount / quote.amountTo;
        } else if (codeTo === this.getBaseCurrency()) {
            const quote = await this.baseQuote(codeFrom);
            dto.amountTo = amount * quote.amountTo;
        } else {
            const firstQuote = await this.baseQuote(codeFrom);
            const secondQuote = await this.baseQuote(codeTo);
            dto.amountTo = amount / firstQuote.amountTo * secondQuote.amountTo;
        }

        return dto;
    }

}