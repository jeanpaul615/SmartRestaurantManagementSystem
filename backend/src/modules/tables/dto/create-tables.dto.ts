import { IsString, MinLength, IsNumber } from "class-validator";

export class CreateTableDto {
    @IsNumber()
    number: number;

    @IsNumber()
    capacity: number;

    @IsString()
    @MinLength(2)
    status: string;

    @IsNumber()
    restaurantId: number;
}