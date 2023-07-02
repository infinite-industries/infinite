import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export const EVENT_PAGINATION_DEFAULT_PAGE = 1;
export const EVENT_PAGINATION_DEFAULT_PAGE_SIZE = 20;

export class PaginationDto {
  @Transform((value) => toNumber(value))
  @IsNumber({ allowNaN: false })
  @IsOptional()
  public page: number = EVENT_PAGINATION_DEFAULT_PAGE;

  @Transform((value) => toNumber(value))
  @IsNumber({ allowNaN: false })
  @IsOptional()
  public pageSize: number = EVENT_PAGINATION_DEFAULT_PAGE_SIZE;
}

function toNumber(val: string): number {
  return Number.parseInt(val);
}
