// base-web-client.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

@Injectable({ providedIn: 'root' })
export class BaseWebClient {
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly logErrors = environment.logHttpErrors;

  private url(route: string): string {
    const path = route.startsWith('/') ? route : `/${route}`;
    return `${this.baseUrl}${path}`;
  }

  private buildUrl(route: string, options?: HttpOptions): string {
    const url = new URL(this.url(route));
    if (options?.params) {
      Object.entries(options.params).forEach(([k, v]) =>
        url.searchParams.set(k, String(v))
      );
    }
    return url.toString();
  }

  private buildHeaders(options?: HttpOptions): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    };
  }

  private handleError(method: string, url: string, error: unknown): null {
    if (this.logErrors) {
      console.error(`[HTTP ${method}] ${url}`, error);
    }
    return null;
  }

  private async request<T>(
    method: string,
    route: string,
    options?: HttpOptions,
    body?: unknown
  ): Promise<T | null> {
    const url = this.buildUrl(route, options);
    try {
      const response = await fetch(url, {
        method,
        headers: this.buildHeaders(options),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      // 204 No Content
      const text = await response.text();
      return text ? (JSON.parse(text) as T) : null;
    } catch (e) {
      return this.handleError(method, url, e);
    }
  }

  async get<T>(route: string, options?: HttpOptions): Promise<T | null> {
    return this.request<T>('GET', route, options);
  }

  async post<TBody, TResponse>(route: string, body: TBody, options?: HttpOptions): Promise<TResponse | null> {
    return this.request<TResponse>('POST', route, options, body);
  }

  async put<TBody, TResponse>(route: string, body: TBody, options?: HttpOptions): Promise<TResponse | null> {
    return this.request<TResponse>('PUT', route, options, body);
  }

  async patch<TBody, TResponse>(route: string, body: TBody, options?: HttpOptions): Promise<TResponse | null> {
    return this.request<TResponse>('PATCH', route, options, body);
  }

  async delete<T>(route: string, options?: HttpOptions): Promise<T | null> {
    return this.request<T>('DELETE', route, options);
  }
}