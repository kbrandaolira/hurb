import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertCurrencies1577060561546 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO currency (code,name) VALUES ("USD", "Dollar")');
        await queryRunner.query('INSERT INTO currency (code,name) VALUES ("BRL", "Real")');
        await queryRunner.query('INSERT INTO currency (code,name) VALUES ("EUR", "Euro")');
        await queryRunner.query('INSERT INTO currency (code,name) VALUES ("BTC", "Bitcoin")');
        await queryRunner.query('INSERT INTO currency (code,name) VALUES ("ETH", "Ethereum")');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM currency WHERE code = "USD"');
        await queryRunner.query('DELETE FROM currency WHERE code = "BRL"');
        await queryRunner.query('DELETE FROM currency WHERE code = "EUR"');
        await queryRunner.query('DELETE FROM currency WHERE code = "BTC"');
        await queryRunner.query('DELETE FROM currency WHERE code = "ETH"');
    }

}
