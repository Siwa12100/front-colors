import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PictureWebClient } from '../../src/app/core/http/web-clients/picture.web-client';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';

describe('PictureWebClient - Integration', () => {
  const base = new BaseWebClient();
  const client = new PictureWebClient(base);

  async function cleanPictures() {
    const pictures = await base.get<any[]>('/api/pictures');
    if (pictures) {
      for (const pic of pictures) {
        await base.delete(`/api/pictures/${pic.id}`);
      }
    }
  }

  beforeAll(async () => {
    await cleanPictures();
  });

  afterAll(async () => {
    await cleanPictures();
    const remaining = await base.get<any[]>('/api/pictures');
    expect(remaining?.length ?? 0).toBe(0);
  });

  it('should fetch all pictures', async () => {
    const result = await client.getAll();
    expect(result).not.toBeNull();
  });

  it('should call upload from drive', async () => {
    const result = await client.uploadFromDrive();
    expect(result).not.toBeNull();
  });
});
