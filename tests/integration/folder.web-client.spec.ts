import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FolderWebClient } from '../../src/app/core/http/web-clients/folder.web-client';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';

describe('FolderWebClient - Integration', () => {
  const base = new BaseWebClient();
  const client = new FolderWebClient(base);

  let workspaceId: number;

  async function cleanFolders() {
    const folders = await base.get<any[]>('/api/folders');
    if (folders) {
      for (const folder of folders) {
        await base.delete(`/api/folders/${folder.id}`);
      }
    }
  }

  async function cleanWorkspaces() {
    const workspaces = await base.get<any[]>('/api/workspaces');
    if (workspaces) {
      for (const ws of workspaces) {
        await base.delete(`/api/workspaces/${ws.id}`);
      }
    }
  }

  beforeAll(async () => {
    await cleanFolders();
    await cleanWorkspaces();

    const ws = await base.post<any, any>('/api/workspaces', {
      name: 'integration-ws',
      isSystem: false,
      favorites: [],
      sources: [],
    });

    workspaceId = ws.id;
  });

  afterAll(async () => {
    await cleanFolders();
    await cleanWorkspaces();

    const folders = await base.get<any[]>('/api/folders');
    const workspaces = await base.get<any[]>('/api/workspaces');

    expect(folders?.length ?? 0).toBe(0);
    expect(workspaces?.length ?? 0).toBe(0);
  });

  it('should create a folder', async () => {
    const folder = await client.create({
      name: 'integration-folder',
      workspace_id: workspaceId,
    });

    expect(folder).not.toBeNull();
    expect(folder?.workspace_id).toBe(workspaceId);
  });

  it('should get folder by id', async () => {
    const folders = await base.get<any[]>('/api/folders');
    const folder = folders![0];

    const result = await client.getById(folder.id);
    expect(result?.id).toBe(folder.id);
  });
});
