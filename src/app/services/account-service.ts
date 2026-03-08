import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AccountService {

  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor() { }

  public isNotEmptyUsername(username: string): boolean {
    return username.trim().length != 0;
  }

  public isSamePassword(pass1: string, pass2: string): boolean {
    return pass1 == pass2;
  }

  public isStrongPassword(password: string): boolean {
    if (password.length < 8) return false;
    const weak = ['1234', '123456', 'admin', 'user', 'password'];
    for (const w of weak) {
      if (password.includes(w)) return false;
    }
    return true;
  }


  /** Redirige le navigateur vers le backend pour lancer le flux Google OAuth */
  public loginWithGoogle(): void {
    window.location.href = `${this.apiBaseUrl}/auth/login`;
  }

  /** Vérifie si un token JWT est présent dans le localStorage */
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Retourne le token JWT stocké ou null */
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Retourne les infos utilisateur stockées lors du callback */
  public getUserInfo(): { user_id: string; email: string; fullName: string; role: string } | null {
    const user_id = localStorage.getItem('user_id');
    const email = localStorage.getItem('email');
    if (!email || !user_id) return null;
    return {
      user_id,
      email,
      fullName: localStorage.getItem('full_name') ?? '',
      role: localStorage.getItem('role') ?? '',
    };
  }

  public getWorkspaceId(): number | null {
    const id = localStorage.getItem('workspace_id');
    return id ? Number(id) : null;
  }

  public setWorkspaceId(id: number): void {
    localStorage.setItem('workspace_id', String(id));
  }

  /** Déconnecte l'utilisateur (supprime les données du localStorage) */
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('full_name');
    localStorage.removeItem('role');
  }
}
