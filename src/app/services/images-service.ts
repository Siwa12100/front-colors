import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Photo } from '../models';
import { AccountService } from './account-service';

export interface PaginatedPictures {
  data: Photo[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private accountService = inject(AccountService);

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly workspaceId = this.accountService.getWorkspaceId() ?? 1;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /** Récupère les images d'un workspace */
  public async getImagesByWorkspace(
    workspaceId: number = this.workspaceId,
    page = 1,
    perPage = 20
  ): Promise<PaginatedPictures> {
    const response = await fetch(
      `${this.apiBaseUrl}/workspaces/${workspaceId}/pictures?page=${page}&per_page=${perPage}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des images (${response.status})`);
    }

    return response.json();
  }

  /** Récupère une image par son id */
  public async getImageById(pictureId: number): Promise<Photo> {
    const response = await fetch(
      `${this.apiBaseUrl}/pictures/${pictureId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Image introuvable (${response.status})`);
    }

    return response.json();
  }

  /** Met à jour une image */
  public async updateImage(pictureId: number, data: Partial<Photo>): Promise<Photo> {
    const response = await fetch(
      `${this.apiBaseUrl}/pictures/${pictureId}`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour (${response.status})`);
    }

    return response.json();
  }
}