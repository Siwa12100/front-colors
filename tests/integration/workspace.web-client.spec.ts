import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WorkspaceWebClient } from '../../src/app/core/http/web-clients/workspace.web-client';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';

describe('WorkspaceWebClient - Integration', () => {
  const base = new BaseWebClient();
  const client = new WorkspaceWebClient(base);

  async function cleanWorkspaces() {
    const result = await client.getAll();
    if (result?.data) {
      for (const ws of result.data) {
        await base.delete(`/api/workspaces/${ws.id}`);
      }
    }
  }

  beforeAll(async () => {
    await cleanWorkspaces();
  });

  afterAll(async () => {
    await cleanWorkspaces();
    const remaining = await client.getAll();
    expect(remaining?.data.length ?? 0).toBe(0);
  });

  it('should fetch all workspaces', async () => {
    const result = await client.getAll();
    expect(result).not.toBeNull();
  });
});
