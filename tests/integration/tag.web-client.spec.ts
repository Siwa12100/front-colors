import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';
import { TagWebClient } from '../../src/app/core/http/web-clients/tag.web-client';
// import { BaseWebClient } from '@/app/core/http/base-web-client';
// import { TagWebClient } from '@/app/core/http/web-clients/tag.web-client';

describe('TagWebClient - Integration', () => {
  const base = new BaseWebClient();
  const client = new TagWebClient(base);

  async function clean() {
    const response = await client.getAll(1, 100);
    const tags = response?.data ?? [];

    for (const tag of tags) {
      await client.delete(tag.id);
    }
  }

  beforeAll(async () => {
    await clean();
  });

  afterAll(async () => {
    await clean();
  });

  it('should create a tag', async () => {
    const tag = await client.create({
      name: 'test-tag',
      hex_code: '#ABCDEF',
    });

    expect(tag).not.toBeNull();
    expect(tag?.name).toBe('test-tag');
  });

  it('should retrieve paginated tags', async () => {
    const response = await client.getAll();
    expect(response).not.toBeNull();
    expect(Array.isArray(response?.data)).toBe(true);
  });
});
