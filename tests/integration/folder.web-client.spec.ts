import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';
import { FolderWebClient } from '../../src/app/core/http/web-clients/folder.web-client';
import { WorkspaceWebClient } from '../../src/app/core/http/web-clients/workspace.web-client';
// import { BaseWebClient } from '@/app/core/http/base-web-client';
// import { FolderWebClient } from '@/app/core/http/web-clients/folder.web-client';
// import { WorkspaceWebClient } from '@/app/core/http/web-clients/workspace.web-client';
// import { BaseWebClient } from '@/app/core/http/base-web-client';
// import { FolderWebClient } from '@/app/core/http/web-clients/folder.web-client';
// import { WorkspaceWebClient } from '@/app/core/http/web-clients/workspace.web-client';

describe('FolderWebClient - Integration', () => {
  const USER_ID = 1;

  const base = new BaseWebClient();
  const folderClient = new FolderWebClient(base);
  const workspaceClient = new WorkspaceWebClient(base);

  let workspaceId: number;
  let createdFolderId: number;

  beforeAll(async () => {
    const ws = await workspaceClient.getAll(USER_ID);
    workspaceId = ws!.data[0].id;
  });

  afterAll(async () => {
    if (createdFolderId) {
      await folderClient.delete(createdFolderId);
    }
  });

  it('should create a folder', async () => {
    const folder = await folderClient.create({
      name: 'test-folder',
      workspace_id: workspaceId,
    });

    expect(folder).not.toBeNull();
    createdFolderId = folder!.id;
  });

  it('should get folder by id', async () => {
    const folder = await folderClient.getById(createdFolderId);
    expect(folder?.id).toBe(createdFolderId);
  });

  it('should update folder', async () => {
    const updated = await folderClient.update(createdFolderId, {
      name: 'updated-folder',
    });

    expect(updated?.name).toBe('updated-folder');
  });

  it('should get children folders', async () => {
    const children = await folderClient.getChildren(createdFolderId);
    expect(children).not.toBeNull();
    expect(Array.isArray(children?.data)).toBe(true);
  });
});
