import { TagDto } from '../dtos/tag.dto';
import { Tag } from '../models/tag.model';

export function mapTag(dto: TagDto): Tag {
  return {
    id: dto.id,
    name: dto.name,
    hexCode: dto.hex_code,
  };
}
