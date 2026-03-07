import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BaseWebClient } from '../../../src/app/core/http/base-web-client';
import { FolderWebClient } from '../../../src/app/core/http/web-clients/folder.web-client';
import { WorkspaceWebClient } from '../../../src/app/core/http/web-clients/workspace.web-client';

describe('FolderWebClient - Integration', () => {
  const USER_ID = 1;

  const base = new BaseWebClient();
  const folderClient = new FolderWebClient(base);
  const workspaceClient = new WorkspaceWebClient(base);

  let workspaceId: number;
  let folderId: number;

  beforeAll(async () => {
    const ws = await workspaceClient.getAll(USER_ID);
    workspaceId = ws!.data[0].id;
  });

  afterAll(async () => {
    if (folderId) {
      await folderClient.delete(folderId);
    }
  });

  it('should create folder', async () => {
    const folder = await folderClient.create({
      name: 'test-folder',
      workspace_id: workspaceId,
    });

    folderId = folder!.id;
    expect(folder?.workspace_id).toBe(workspaceId);
  });

  it('should update folder name', async () => {
    const updated = await folderClient.update(folderId, {
      name: 'renamed-folder',
    });

    expect(updated?.name).toBe('renamed-folder');
  });

  it('should retrieve folder by id', async () => {
    const found = await folderClient.getById(folderId);
    expect(found?.id).toBe(folderId);
  });

  it('should get children folders', async () => {
    const children = await folderClient.getChildren(folderId);
    expect(Array.isArray(children?.data)).toBe(true);
  });

  it('should get pictures of folder (paginated)', async () => {
    const pictures = await folderClient.getPictures(folderId);
    expect(Array.isArray(pictures?.data)).toBe(true);
  });
});
