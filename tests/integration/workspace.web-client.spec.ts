import { describe, it, expect } from 'vitest';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';
import { WorkspaceWebClient } from '../../src/app/core/http/web-clients/workspace.web-client';
// import { BaseWebClient } from '@/app/core/http/base-web-client';
// import { WorkspaceWebClient } from '@/app/core/http/web-clients/workspace.web-client';

describe('WorkspaceWebClient - Integration', () => {
  const USER_ID = 1;

  const base = new BaseWebClient();
  const client = new WorkspaceWebClient(base);

  it('should get workspaces for a user (auto-creates if empty)', async () => {
    const response = await client.getAll(USER_ID);

    expect(response).not.toBeNull();
    expect(response?.data.length).toBeGreaterThan(0);
  });

  it('should get workspace by id', async () => {
    const response = await client.getAll(USER_ID);
    const workspace = response?.data[0];

    const found = await client.getById(workspace!.id);

    expect(found?.id).toBe(workspace!.id);
  });

  it('should get folders of a workspace', async () => {
    const response = await client.getAll(USER_ID);
    const workspace = response?.data[0];

    const folders = await client.getFolders(workspace!.id);

    expect(folders).not.toBeNull();
    expect(Array.isArray(folders?.data)).toBe(true);
  });
});
