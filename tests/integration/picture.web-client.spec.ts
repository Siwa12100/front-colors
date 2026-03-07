import { describe, it, expect } from 'vitest';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';
import { PictureWebClient } from '../../src/app/core/http/web-clients/picture.web-client';

describe('PictureWebClient - Integration', () => {
  const base = new BaseWebClient();
  const client = new PictureWebClient(base);

  let pictureId: number | null = null;

  it('should retrieve paginated pictures', async () => {
    const response = await client.getAll();
    expect(Array.isArray(response?.data)).toBe(true);

    if (response!.data.length > 0) {
      pictureId = response!.data[0].id;
    }
  });

  it('should get picture by id', async () => {
    if (!pictureId) return;

    const found = await client.getById(pictureId);
    expect(found?.id).toBe(pictureId);
  });

  it('should update picture comment', async () => {
    if (!pictureId) return;

    const updated = await client.update(pictureId, {
      comment: 'updated-comment',
    });

    expect(updated?.comment).toBe('updated-comment');
  });

  it('should call upload endpoint', async () => {
    const response = await client.uploadFromDrive();
    expect(response?.pictures_added_count).toBeGreaterThanOrEqual(0);
  });
});
