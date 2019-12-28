import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../src/currency/currency.entity';
import { AppModule } from '../src/app.module';
import { CurrencyDto } from '../src/currency/dto/currency.dto';
import { CurrencyService } from '../src/currency/currency.service';
import { ExchangeAPI } from '../src/exchange/exchange.api';

describe('CurrencyController', () => {
    let app: INestApplication;
    let currencyService: CurrencyService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Currency]),
                AppModule,
            ],
        }).compile();

        app = module.createNestApplication();
        currencyService = app.get(CurrencyService);
        await app.init();
    });

    describe('save()', () => {
        test('should return 403 when currency code is less than 3 characters', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: 'BR',
                    name: 'Real'
                })
                .expect(HttpStatus.BAD_REQUEST)
                .expect(response => {
                    expect(response.body.message).toContain('code size must be 3');
                });
        })

        test('should return 403 when currency code is higher than 3 characters', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: 'BRSL',
                    name: 'Real'
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('code size must be 3');
                });
        });

        test('should return 403 when currency code is already registered', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: currencyCreated.code,
                    name: currencyCreated.name
                })
                .expect(HttpStatus.BAD_REQUEST).expect(async response => {
                    expect(response.body.message).toContain('code already exists');
                });

            await currencyService.delete(currencyCreated.id);
        });

        test('should return 403 when currency name is empty', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: 'BRL',
                    name: ''
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('name size must be between 1 and 255');
                });
        });

        test('should return 403 when currency name is higher than 255', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: 'BRL',
                    name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('name size must be between 1 and 255');
                });
        });

        test('should return 403 when currency name is already registered', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: 'BR2',
                    name: currencyCreated.name
                })
                .expect(HttpStatus.BAD_REQUEST).expect(async response => {
                    expect(response.body.message).toContain('name already exists');
                });

            await currencyService.delete(currencyCreated.id);
        });

        test('should return 403 when currency code is not registered in external exchange api', () => {
            return request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: 'WCR',
                    name: 'Wrong Currency'
                })
                .expect(HttpStatus.BAD_REQUEST).expect(response => {
                    expect(response.body.message).toContain('invalid code');
                });
        });

        test('should return 201 and save currency', async () => {
            const currencyDto: CurrencyDto = {
                code: 'BRL',
                name: 'Real'
            }

            return request(app.getHttpServer())
                .post('/currency')
                .send(currencyDto)
                .expect(HttpStatus.CREATED)
                .expect(async response => {
                    const currencyCreated = await currencyService.findByCode(currencyDto.code);
                    expect(currencyCreated.code).toEqual(currencyDto.code);
                    expect(currencyCreated.name).toEqual(currencyDto.name);
                    await currencyService.delete(currencyCreated.id);
                });
        });
    });

    describe('delete()', () => {
        test('should return 404 when currency id does not exist', () => {
            return request(app.getHttpServer())
                .delete('/currency/1')
                .expect(HttpStatus.NOT_FOUND);
        });

        test('should return 200 and currency must be deleted', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            return request(app.getHttpServer())
                .delete(`/currency/${currencyCreated.id}`)
                .expect(HttpStatus.OK);

        });
    });


    describe('convert()', () => {
        test('should return 403 when amount is 0', () => {
            return request(app.getHttpServer())
                .get('/currency/convert?codeFrom=x&codeTo=y&amount=0')
                .expect(HttpStatus.BAD_REQUEST)
                .expect(async response => {
                    expect(response.body.message).toContain('amount must be higher than zero');
                });
        });

        test('should return 403 when currency code from does not exist', () => {
            return request(app.getHttpServer())
                .get('/currency/convert?codeFrom=x&codeTo=y&amount=100')
                .expect(HttpStatus.BAD_REQUEST)
                .expect(async response => {
                    expect(response.body.message).toContain(`code x does not exist`);
                });
        });

        test('should return 403 when currency code to does not exist', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyCreated.code}&codeTo=y&amount=100`)
                .expect(HttpStatus.BAD_REQUEST)
                .expect(async response => {
                    expect(response.body.message).toContain(`code y does not exist`);

                });

            await currencyService.delete(currencyCreated.id);
        });

        test('should return 200 and convert EUR to USD', async () => {
            const amount = 100;

            const currencyFrom = await currencyService.save({
                name: 'Euro',
                code: 'EUR',
            });

            const currencyTo = await currencyService.save({
                name: 'Dolar',
                code: 'USD',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyFrom.code}&codeTo=${currencyTo.code}&amount=${amount}`)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new ExchangeAPI().quote(currencyFrom.code, currencyTo.code, amount);

                    expect(response.body.codeFrom).toBe(currencyFrom.code);
                    expect(response.body.codeTo).toBe(currencyTo.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(response.body.amountTo).toBe(exchangeDto.amountTo);
                });

            await currencyService.delete(currencyFrom.id);
            await currencyService.delete(currencyTo.id);
        });

        test('should return 200 and convert EUR to BRL', async () => {
            const amount = 100;

            const currencyFrom = await currencyService.save({
                name: 'Euro',
                code: 'EUR',
            });

            const currencyTo = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyFrom.code}&codeTo=${currencyTo.code}&amount=${amount}`)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new ExchangeAPI().quote(currencyFrom.code, currencyTo.code, amount);

                    expect(response.body.codeFrom).toBe(currencyFrom.code);
                    expect(response.body.codeTo).toBe(currencyTo.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(response.body.amountTo).toBe(exchangeDto.amountTo);
                });

            await currencyService.delete(currencyFrom.id);
            await currencyService.delete(currencyTo.id);
        });

        test('should return 200 and convert BRL to EUR', async () => {
            const amount = 100;

            const currencyFrom = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            const currencyTo = await currencyService.save({
                name: 'Euro',
                code: 'EUR',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currencyFrom.code}&codeTo=${currencyTo.code}&amount=${amount}`)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new ExchangeAPI().quote(currencyFrom.code, currencyTo.code, amount);

                    expect(response.body.codeFrom).toBe(currencyFrom.code);
                    expect(response.body.codeTo).toBe(currencyTo.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(response.body.amountTo).toBe(exchangeDto.amountTo);
                });

            await currencyService.delete(currencyFrom.id);
            await currencyService.delete(currencyTo.id);
        });

        test('should return 200 and convert BRL to BRL', async () => {
            const amount = 100;

            const currency = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            });

            await request(app.getHttpServer())
                .get(`/currency/convert?codeFrom=${currency.code}&codeTo=${currency.code}&amount=${amount}`)
                .expect(HttpStatus.OK)
                .expect(async response => {
                    const exchangeDto = await new ExchangeAPI().quote(currency.code, currency.code, amount);

                    expect(response.body.codeFrom).toBe(currency.code);
                    expect(response.body.codeTo).toBe(currency.code);
                    expect(Number(response.body.amountFrom)).toBe(amount);
                    expect(Number(response.body.amountTo)).toBe(exchangeDto.amountTo);
                });

            await currencyService.delete(currency.id);
        });
    });

});