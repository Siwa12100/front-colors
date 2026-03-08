import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { TagService } from '../../../src/app/services/tags/tag.service';
import { TagWebClient } from '../../../src/app/core/http/web-clients/tag.web-client';
import { BaseWebClient } from '../../../src/app/core/http/base-web-client';

describe('TagService - Integration', () => {

  const base = new BaseWebClient();
  const webClient = new TagWebClient(base);
  const service = new TagService(webClient);

  let createdTagId: number;
  const TEST_TAG_NAME = 'int-test';

  const TEST_HEX = '#FF00AA';

  afterAll(async () => {
    if (createdTagId) {
      try {
        await service.delete(createdTagId);
      } catch {
        // ignore cleanup errors
      }
    }
  });

  beforeAll(async () => {
    const page = await service.getAll(1, 1000);
    console.log('TOTAL BEFORE CLEAN:', page.total);

    for (const tag of page.items) {
        await service.delete(tag.id);
    }

    const check = await service.getAll(1, 1000);
    console.log('TOTAL AFTER CLEAN:', check.total);
    });



  it('should create a new tag', async () => {
    const tag = await service.create(TEST_TAG_NAME, TEST_HEX);

    expect(tag.id).toBeDefined();
    expect(tag.name).toBe(TEST_TAG_NAME);
    expect(tag.hexCode).toBe(TEST_HEX);

    createdTagId = tag.id;
  });

  it('should return paginated tags', async () => {
    const page = await service.getAll(1, 20);

    expect(page.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(page.items)).toBe(true);
    expect(page.page).toBe(1);
  });

  it('should find tag by name', async () => {
    const found = await service.findByName(TEST_TAG_NAME);

    expect(found).toBeDefined();
    expect(found?.id).toBe(createdTagId);
  });

  it('should update an existing tag', async () => {
    const updated = await service.update(createdTagId, {
      name: TEST_TAG_NAME + '-updated',
    });

    expect(updated.name).toContain('-updated');
  });

  it('should delete tag', async () => {
    await service.delete(createdTagId);

    const check = await service.findByName(TEST_TAG_NAME + '-updated');

    expect(check).toBeUndefined();

    createdTagId = undefined as any;
  });

});
