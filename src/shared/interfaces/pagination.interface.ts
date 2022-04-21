export interface Pagination<T> {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  data: T;
  totalPages: number;
}
