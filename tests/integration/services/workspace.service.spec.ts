import { describe, it, expect, beforeAll } from 'vitest';
import { WorkspaceService } from '../../../src/app/services/workspaces/workspace.service';
import { WorkspaceWebClient } from '../../../src/app/core/http/web-clients/workspace.web-client';
import { BaseWebClient } from '../../../src/app/core/http/base-web-client';

describe('WorkspaceService - Integration', () => {

  const USER_ID = 1;

  const base = new BaseWebClient();
  const webClient = new WorkspaceWebClient(base);
  const service = new WorkspaceService(webClient);

  let workspaceId: number;

  beforeAll(async () => {
    const page = await service.getAll(USER_ID, 1, 10);
    expect(page.items.length).toBeGreaterThan(0);

    workspaceId = page.items[0].id;
  });

  it('should return paginated workspaces', async () => {
    const page = await service.getAll(USER_ID, 1, 10);

    expect(page.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(page.items)).toBe(true);
    expect(page.page).toBe(1);
  });

  it('should get workspace by id', async () => {
    const workspace = await service.getById(workspaceId);

    expect(workspace.id).toBe(workspaceId);
    expect(typeof workspace.name).toBe('string');
  });

  it('should get folders of workspace', async () => {
    const page = await service.getFolders(workspaceId, 1, 10);

    expect(Array.isArray(page.items)).toBe(true);
    expect(page.page).toBe(1);
  });

  it('should get pictures of workspace', async () => {
    const page = await service.getPictures(workspaceId, 1, 10);

    expect(Array.isArray(page.items)).toBe(true);
    expect(page.page).toBe(1);
  });

  it('should update workspace name', async () => {
    const original = await service.getById(workspaceId);

    const updated = await service.update(workspaceId, {
      name: original.name + '-updated',
    });

    expect(updated.name).toContain('-updated');

    // Restore original name (important for idempotency)
    await service.update(workspaceId, {
      name: original.name,
    });
  });

});
