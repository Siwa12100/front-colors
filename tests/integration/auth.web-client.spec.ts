import { describe, it, expect, afterAll } from 'vitest';
import { BaseWebClient } from '../../src/app/core/http/base-web-client';
import { AuthWebClient } from '../../src/app/core/http/web-clients/auth.web-client';

describe('AuthWebClient - Integration', () => {

  const base = new BaseWebClient();
  const client = new AuthWebClient(base);

  const VALID_TEST_JWT: string | null = null;
  // const VALID_TEST_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  afterAll(() => {
    localStorage.removeItem('jwt');
  });

  it('should return null when no token is provided', async () => {
    localStorage.removeItem('jwt');

    const response = await client.me();

    expect(response).toBeNull();
  });

  it('should return current user when token is valid', async () => {

    if (!VALID_TEST_JWT) {
      console.warn('Skipping test: no VALID_TEST_JWT provided');
      return;
    }

    localStorage.setItem('jwt', VALID_TEST_JWT);

    const response = await client.me();

    expect(response).not.toBeNull();
    expect(response?.email).toBeDefined();
    expect(response?.role).toBeDefined();
  });

});
