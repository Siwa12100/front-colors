import { Injectable } from '@angular/core';
import { BaseWebClient } from '../base-web-client';
import { TagDto } from '../../../dtos/tag.dto';
import { PaginationDto } from '../../../dtos/pagination.dto';

@Injectable({ providedIn: 'root' })
export class TagWebClient {
  private readonly route = '/api/tags';

  constructor(private readonly base: BaseWebClient) {}

  async getAll(
    page = 1,
    perPage = 20
  ): Promise<PaginationDto<TagDto> | null> {
    return this.base.get<PaginationDto<TagDto>>(this.route, {
      params: { page, per_page: perPage },
    });
  }

  async create(payload: {
    name: string;
    hex_code: string;
  }): Promise<TagDto | null> {
    return this.base.post<typeof payload, TagDto>(
      this.route,
      payload
    );
  }

  async update(
    id: number,
    payload: Partial<TagDto>
  ): Promise<TagDto | null> {
    return this.base.put<Partial<TagDto>, TagDto>(
      `${this.route}/${id}`,
      payload
    );
  }

  async delete(id: number): Promise<{ message: string } | null> {
    return this.base.delete<{ message: string }>(
      `${this.route}/${id}`
    );
  }
}
