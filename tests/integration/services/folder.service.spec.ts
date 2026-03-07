import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { BaseWebClient } from '../../../src/app/core/http/base-web-client';

import { FolderService } from '../../../src/app/services/folders/folder.service';
import { FolderWebClient } from '../../../src/app/core/http/web-clients/folder.web-client';

import { WorkspaceService } from '../../../src/app/services/workspaces/workspace.service';
import { WorkspaceWebClient } from '../../../src/app/core/http/web-clients/workspace.web-client';

describe('FolderService - Integration', () => {

  const USER_ID = 1;

  const base = new BaseWebClient();

  const folderWebClient = new FolderWebClient(base);
  const workspaceWebClient = new WorkspaceWebClient(base);

  const service = new FolderService(folderWebClient);
  const workspaceService = new WorkspaceService(workspaceWebClient);

  let workspaceId: number;
  let folderId: number;

  const TEST_FOLDER_NAME = 'int-folder';

  // On récupère un workspace existant
  beforeAll(async () => {
    const page = await workspaceService.getAll(USER_ID, 1, 10);

    expect(page.items.length).toBeGreaterThan(0);

    workspaceId = page.items[0].id;
  });

  afterAll(async () => {
    if (folderId) {
      try {
        await service.delete(folderId);
      } catch {}
    }
  });

  it('should create a folder', async () => {
    const folder = await service.create(
      TEST_FOLDER_NAME,
      workspaceId,
      null
    );

    expect(folder.id).toBeDefined();
    expect(folder.workspaceId).toBe(workspaceId);
    expect(folder.parentFolderId).toBeNull();

    folderId = folder.id;
  });

  it('should get folder by id', async () => {
    const folder = await service.getById(folderId);

    expect(folder.id).toBe(folderId);
    expect(folder.name).toBe(TEST_FOLDER_NAME);
  });

  it('should update folder name', async () => {
    const updated = await service.update(folderId, {
      name: 'int-folder-updated',
    });

    expect(updated.name).toBe('int-folder-updated');
  });

  it('should return empty children', async () => {
    const children = await service.getChildren(folderId);

    expect(Array.isArray(children)).toBe(true);
  });

  it('should delete folder', async () => {
    await service.delete(folderId);

    await expect(service.getById(folderId)).rejects.toThrow();
  });

});
