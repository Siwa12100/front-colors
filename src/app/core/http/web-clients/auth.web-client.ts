import { Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment';
import { BaseWebClient } from '../base-web-client';
import { MeDto } from '../../../dtos/auth.dto';
import { environment } from '../../../../environments/environment';
// import { MeDto } from '../dtos/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthWebClient {

  private readonly route = '/auth';

  constructor(private readonly base: BaseWebClient) {}

  getLoginUrl(): string {
    return `${environment.apiBaseUrl}/auth/login`;
  }

  async me(): Promise<MeDto | null> {
    return this.base.get<MeDto>(`${this.route}/me`);
  }

  storeToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}


// @Injectable({ providedIn: 'root' })
// export class AuthWebClient {

//   private readonly route = '/auth';

//   constructor(private readonly base: BaseWebClient) {}

//   /**
//    * Returns the Google login URL.
//    * Must be used with window.location.href
//    */
//   getLoginUrl(): string {
//     return `${environment.apiBaseUrl}/auth/login`;
//   }

//   /**
//    * Returns the currently authenticated user.
//    * Requires Authorization: Bearer <token>
//    */
//   async me(): Promise<MeDto | null> {
//     return this.base.get<MeDto>(`${this.route}/me`);
//   }

//   /**
//    * Helper to store JWT locally
//    */
//   storeToken(token: string): void {
//     localStorage.setItem('jwt', token);
//   }

//   /**
//    * Remove JWT (logout)
//    */
//   logout(): void {
//     localStorage.removeItem('jwt');
//   }

//   /**
//    * Get stored token
//    */
//   getToken(): string | null {
//     return localStorage.getItem('jwt');
//   }
// }
