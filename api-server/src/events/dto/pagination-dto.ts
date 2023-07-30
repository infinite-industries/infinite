import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, MAX, Validate } from 'class-validator';

export const EVENT_PAGINATION_DEFAULT_PAGE = 1;
export const EVENT_PAGINATION_DEFAULT_PAGE_SIZE = 20;

export const EVENT_PAGINATION_MAX_PAGE_SIZE = 300;

export class PaginationDto {
  @Transform((value) => toNumber(value))
  @IsNumber({ allowNaN: false })
  @IsOptional()
  public page: number = EVENT_PAGINATION_DEFAULT_PAGE;

  @Transform((value) => toNumber(value))
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Max(EVENT_PAGINATION_MAX_PAGE_SIZE)
  public pageSize: number = EVENT_PAGINATION_DEFAULT_PAGE_SIZE;
}

function toNumber(val: string): number {
  return Number.parseInt(val);
}
