import { Injectable } from "@nestjs/common";
import * as fs from 'fs'
import * as dotenv from 'dotenv';
import { EnvConfig } from "./env.config";


@Injectable()
export class ConfigService {
    private envConfig: EnvConfig;

    constructor() {
        const output = dotenv.parse(fs.readFileSync(`.env.${process.env.NODE_ENV}`));
        this.envConfig = {
            API_KEY: output.API_KEY,
            DB_HOST: output.DB_HOST,
            DB_NAME: output.DB_NAME,
            DB_PASSWORD: output.DB_PASSWORD,
            DB_PORT: Number(output.DB_PORT),
            DB_SYNC: Boolean(output.DB_SYNC),
            DB_TYPE: output.DB_TYPE,
            DB_USERNAME: output.DB_USERNAME,
            NODE_ENV: output.NODE_ENV
        }
    }

    getEnvConfig(): EnvConfig {
        return this.envConfig;
    }
}