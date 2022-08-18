import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  @ApiHideProperty()
  data: T[];
  totalPages: number;
}
