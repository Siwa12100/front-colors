import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { TagWebClient } from '../../src/app/core/http/web-clients/tag.web-client';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';

describe('TagWebClient - Integration', () => {
  const base = new BaseWebClient();
  const client = new TagWebClient(base);

  async function cleanTags() {
    const tags = await client.getAll();
    if (tags) {
      for (const tag of tags) {
        await client.delete(tag.id);
      }
    }
  }

  beforeAll(async () => {
    await cleanTags();
  });

  afterAll(async () => {
    await cleanTags();
    const remaining = await client.getAll();
    expect(remaining?.length ?? 0).toBe(0);
  });

  it('should create a tag', async () => {
    const created = await client.create({
      name: 'integration-tag',
      hex_code: '#FF0000',
    });

    expect(created).not.toBeNull();
    expect(created?.name).toBe('integration-tag');
  });

  it('should get all tags', async () => {
    const tags = await client.getAll();
    expect(tags).not.toBeNull();
    expect(tags!.length).toBeGreaterThan(0);
  });

  it('should update a tag', async () => {
    const tags = await client.getAll();
    const tag = tags![0];

    const updated = await client.update(tag.id, {
      name: 'updated-tag',
    });

    expect(updated?.name).toBe('updated-tag');
  });

  it('should delete a tag', async () => {
    const tags = await client.getAll();
    const tag = tags![0];

    await client.delete(tag.id);

    const after = await client.getAll();
    expect(after?.find(t => t.id === tag.id)).toBeUndefined();
  });
});
