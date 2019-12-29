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
            NODE_ENV: output.NODE_ENV,
            DB_CONNECTION_NAME: output.DB_CONNECTION_NAME,
            API_KEY: output.API_KEY,
        }
    }

    getEnvConfig(): EnvConfig {
        return this.envConfig;
    }
}