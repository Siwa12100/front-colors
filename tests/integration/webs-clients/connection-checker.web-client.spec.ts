import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ConnectionCheckerWebClient } from '../../../src/app/core/http/web-clients/connection-checker.web-client';
import { BaseWebClient } from '../../../src/app/core/http/base-web-client';


describe('ConnectionCheckerWebClient - Integration', () => {
  it('should successfully connect to the Colors API', async () => {
    const baseClient = new BaseWebClient();
    const checker = new ConnectionCheckerWebClient(baseClient);
    expect(await checker.checkConnection()).toBe(true);
  });
});

