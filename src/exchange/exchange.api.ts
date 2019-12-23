import axios from 'axios';
import { ExchangeDto } from './dto/exchange.dto';


/* we consume from https://economia.awesomeapi.com.br 
we quote 1 real (BRL), our base currency, to another currency 
example: 1 real equal 4 dollars */

export class ExchangeAPI {

    private readonly baseCurency: string = 'BRL';
    private readonly url: string = 'https://economia.awesomeapi.com.br';

    getBaseCurrency() {
        return this.baseCurency;
    }

    async isValidCode(code: string): Promise<boolean> {
        return await this.quote(code) !== null;
    }

    async quote(code: string): Promise<ExchangeDto> {
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

}