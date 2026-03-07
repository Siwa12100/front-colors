import { describe, it, expect } from 'vitest';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';
import { PictureWebClient } from '../../src/app/core/http/web-clients/picture.web-client';
// import { BaseWebClient } from '@/app/core/http/base-web-client';
// import { PictureWebClient } from '@/app/core/http/web-clients/picture.web-client';

describe('PictureWebClient - Integration', () => {
  const base = new BaseWebClient();
  const client = new PictureWebClient(base);

  it('should retrieve paginated pictures', async () => {
    const response = await client.getAll();
    expect(response).not.toBeNull();
    expect(Array.isArray(response?.data)).toBe(true);
  });

  it('should get picture by id if exists', async () => {
    const response = await client.getAll();
    if (response!.data.length === 0) return;

    const pic = response!.data[0];

    const found = await client.getById(pic.id);
    expect(found?.id).toBe(pic.id);
  });
});
