import { PaginationDto } from '../dtos/pagination.dto';
import { Page } from '../models/page.model';

export function mapPagination<TDto, TModel>(
  dto: PaginationDto<TDto>,
  mapper: (item: TDto) => TModel
): Page<TModel> {
  return {
    items: dto.data.map(mapper),
    total: dto.total,
    page: dto.page,
    pages: dto.pages,
  };
}
