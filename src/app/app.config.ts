import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// Services
import { PictureService } from './services/pictures/picture.service';
import { FolderService } from './services/folders/folder.service';
import { WorkspaceService } from './services/workspaces/workspace.service';
import { TagService } from './services/tags/tag.service';
// import { AuthService } from './services/auth/auth.service';

// Tokens
import { PICTURE_SERVICE } from './core/di-tokens/picture.token';
import { FOLDER_SERVICE } from './core/di-tokens/folder.token';
import { WORKSPACE_SERVICE } from './core/di-tokens/workspace.token';
import { TAG_SERVICE } from './core/di-tokens/tag.token';
// import { AUTH_SERVICE } from './core/di-tokens/auth.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    // ✅ Dependency Injection via tokens
    { provide: PICTURE_SERVICE, useClass: PictureService },
    { provide: FOLDER_SERVICE, useClass: FolderService },
    { provide: WORKSPACE_SERVICE, useClass: WorkspaceService },
    { provide: TAG_SERVICE, useClass: TagService }
    // { provide: AUTH_SERVICE, useClass: AuthService },
  ]
};
