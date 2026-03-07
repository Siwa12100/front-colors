export interface PaginationDto<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}
