export class PaginationDto<T> {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  data: T[];
  totalPages: number;
}
