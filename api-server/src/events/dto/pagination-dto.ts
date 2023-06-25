import {Transform} from "class-transformer";
import {IsNumber, IsOptional} from "class-validator";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export class PaginationDto {
    @Transform(( value ) => toNumber(value))
    @IsNumber({ allowNaN: false })
    @IsOptional()
    public page: number = DEFAULT_PAGE;

    @Transform((value) => toNumber(value))
    @IsNumber({ allowNaN: false })
    @IsOptional()
    public pageSize: number = DEFAULT_PAGE_SIZE;
}

function toNumber(val: string): number {
    return Number.parseInt(val)
}
