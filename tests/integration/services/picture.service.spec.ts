import { describe, it, expect, beforeAll } from 'vitest';

import { BaseWebClient } from '../../../src/app/core/http/base-web-client';
import { PictureWebClient } from '../../../src/app/core/http/web-clients/picture.web-client';
import { PictureService } from '../../../src/app/services/pictures/picture.service';

describe('PictureService - Integration', () => {

  const base = new BaseWebClient();
  const webClient = new PictureWebClient(base);
  const service = new PictureService(webClient);

  let pictureId: number;

  beforeAll(async () => {
    const page = await service.search({}, 1, 10);

    expect(page.items.length).toBeGreaterThan(0);

    pictureId = page.items[0].id;
  });

  it('should return paginated pictures', async () => {
    const page = await service.search({}, 1, 10);

    expect(Array.isArray(page.items)).toBe(true);
    expect(page.page).toBe(1);
    expect(page.total).toBeGreaterThanOrEqual(1);
  });

  it('should filter by name', async () => {
    const page = await service.search({ name: '' }, 1, 10);

    expect(Array.isArray(page.items)).toBe(true);
  });

  it('should get picture by id', async () => {
    const picture = await service.getById(pictureId);

    expect(picture.id).toBe(pictureId);
    expect(typeof picture.name).toBe('string');
  });

  it('should update picture name', async () => {
    const original = await service.getById(pictureId);

    const updated = await service.update(pictureId, {
      name: original.name + '-updated',
    });

    expect(updated.name).toContain('-updated');

    // 🔁 Restore original name (important)
    await service.update(pictureId, {
      name: original.name,
    });
  });

  // ✅ UPLOAD FROM DRIVE (structure test uniquement)
  it('should upload from drive and return a number', async () => {
    const result = await service.uploadFromDrive();

    expect(typeof result).toBe('number');
  });

});
