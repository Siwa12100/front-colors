import { Injectable } from '@angular/core';
import { BaseWebClient } from '../base-web-client';

interface ApiInfo {
  name: string;
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionCheckerWebClient {

  private readonly HEALTH_ROUTE = '/';

  constructor(private readonly baseWebClient: BaseWebClient) {}

  async checkConnection(): Promise<boolean> {
    const result = await this.baseWebClient.get<ApiInfo>(this.HEALTH_ROUTE);
    return result !== null;
  }
}
