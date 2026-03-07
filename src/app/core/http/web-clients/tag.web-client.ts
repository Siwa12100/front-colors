import { Injectable } from '@angular/core';
import { BaseWebClient } from '../base-web-client';
import { TagDto } from '../../../dtos/tag.dto';

@Injectable({ providedIn: 'root' })
export class TagWebClient {
  private readonly route = '/api/tags';

  constructor(private readonly base: BaseWebClient) {}

  async getAll(): Promise<TagDto[] | null> {
    return this.base.get<TagDto[]>(this.route);
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
