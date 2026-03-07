import { Injectable } from '@angular/core';
import { TagWebClient } from '../../core/http/web-clients/tag.web-client';
import { ITagService } from './ITagService';
import { mapTag } from '../../mappers/tag.mapper';
import { mapPagination } from '../../mappers/pagination.mapper';
import { Tag } from '../../models/tag.model';

@Injectable()
export class TagService implements ITagService {

  constructor(private readonly client: TagWebClient) {}

  async getAll(page = 1, perPage = 20) {
    const dto = await this.client.getAll(page, perPage);
    if (!dto) throw new Error('Failed to load tags');
    return mapPagination(dto, mapTag);
  }

  async create(name: string, hexCode: string) {
    const dto = await this.client.create({
      name,
      hex_code: hexCode,
    });

    if (!dto) {
      throw new Error('Failed to create tag');
    }

    return mapTag(dto);
  }

  async update(id: number, data: Partial<Tag>) {
    const payload: any = {};

    if (data.name !== undefined) {
      payload.name = data.name;
    }

    if (data.hexCode !== undefined) {
      payload.hex_code = data.hexCode;
    }

    const dto = await this.client.update(id, payload);

    if (!dto) {
      throw new Error('Failed to update tag');
    }

    return mapTag(dto);
  }

  async delete(id: number) {
    await this.client.delete(id);
  }

  async findByName(name: string) {
    const page = await this.getAll(1, 1000);
    return page.items.find(t => t.name === name);
  }
}
