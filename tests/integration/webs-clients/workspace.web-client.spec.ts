import { describe, it, expect } from 'vitest';
import { BaseWebClient } from '../../../src/app/core/http/base-web-client';
import { WorkspaceWebClient } from '../../../src/app/core/http/web-clients/workspace.web-client';

describe('WorkspaceWebClient - Integration', () => {
  const USER_ID = 1;

  const base = new BaseWebClient();
  const client = new WorkspaceWebClient(base);

  let workspaceId: number;

  it('should get workspaces for user', async () => {
    const response = await client.getAll(USER_ID);

    expect(response).not.toBeNull();
    expect(response!.data.length).toBeGreaterThan(0);

    workspaceId = response!.data[0].id;
  });

  it('should get workspace by id', async () => {
    const found = await client.getById(workspaceId);
    expect(found?.id).toBe(workspaceId);
  });

  it('should update workspace name', async () => {
    const updated = await client.update(workspaceId, {
      name: 'updated-workspace',
    });

    expect(updated?.name).toBe('updated-workspace');
  });

  it('should get workspace folders (paginated)', async () => {
    const folders = await client.getFolders(workspaceId);
    expect(Array.isArray(folders?.data)).toBe(true);
  });

  it('should get workspace pictures (paginated)', async () => {
    const pictures = await client.getPictures(workspaceId);
    expect(Array.isArray(pictures?.data)).toBe(true);
  });
});
