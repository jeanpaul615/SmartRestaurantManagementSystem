import { IsNotEmpty, IsString, IsNumber, MinLength } from "class-validator";

export class CreateRestaurantDto {
    @IsString()
    name: string;

    @IsString()
    adress: string;

    @IsString()
    @MinLength(15)
    phone: string;
    
    @IsString()
    description : string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}