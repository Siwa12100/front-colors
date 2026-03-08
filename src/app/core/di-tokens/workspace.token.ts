import { InjectionToken } from '@angular/core';
import { IWorkspaceService } from '../../services/workspaces/IWorkspaceService';

export const WORKSPACE_SERVICE =
  new InjectionToken<IWorkspaceService>('WORKSPACE_SERVICE');
