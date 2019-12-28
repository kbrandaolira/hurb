import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../src/currency/currency.entity';
import { AppModule } from '../src/app.module';
import { CurrencyDto } from '../src/currency/dto/currency.dto';
import { CurrencyService } from '../src/currency/currency.service';

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
                    expect(response.text).toContain('code size must be 3');
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
                    expect(response.text).toContain('code size must be 3');
                });
        });

        test('should return 403 when currency code is already registered', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            })

            await request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: currencyCreated.code,
                    name: currencyCreated.name
                })
                .expect(HttpStatus.BAD_REQUEST).expect(async response => {
                    expect(response.text).toContain('code already exists');
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
                    expect(response.text).toContain('name size must be between 1 and 255');
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
                    expect(response.text).toContain('name size must be between 1 and 255');
                });
        });

        test('should return 403 when currency name is already registered', async () => {
            const currencyCreated = await currencyService.save({
                name: 'Real',
                code: 'BRL',
            })

            await request(app.getHttpServer())
                .post('/currency')
                .send({
                    code: 'BR2',
                    name: currencyCreated.name
                })
                .expect(HttpStatus.BAD_REQUEST).expect(async response => {
                    expect(response.text).toContain('name already exists');
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
                    expect(response.text).toContain('invalid code');
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
        test.todo('should return 404 when currency id does not exist');

        test.todo('should return 200 and currency must be deleted');
    });


    describe('convert()', () => {
        test.todo('should return 403 when amount is 0');

        test.todo('should return 403 when currency code from does not exist');

        test.todo('should return 403 when currency code to does not exist');

        test.todo('should return 200 and convert EUR to USD');

        test.todo('should return 200 and convert EUR to BRL');

        test.todo('should return 200 and convert BRL to EUR');
    });

});