
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CurrencyDto {
    @IsNotEmpty()
    @MaxLength(255)
    readonly name: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(3)
    readonly code: string;
}