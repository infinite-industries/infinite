import { ApiProperty } from '@nestjs/swagger';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';

export class ResponseWrapper {
  @ApiProperty({ example: 'success' })
  status = 'success';

  @ApiProperty({ example: true })
  paginated = false;

  @ApiProperty({ example: 2 })
  page?: number;

  @ApiProperty({ example: 100 })
  totalPages?: number;

  @ApiProperty({ example: 3 })
  nextPage?: number;

  constructor(copy?: Partial<ResponseWrapper>) {
    if (isNotNullOrUndefined(copy) && isNotNullOrUndefined(copy.status)) {
      this.status = copy.status;
      this.paginated = copy.paginated;
      this.page = copy.page;
      this.totalPages = copy.page;
      this.nextPage = copy.page;
    }
  }
}
