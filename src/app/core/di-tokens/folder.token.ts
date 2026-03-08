import { InjectionToken } from '@angular/core';
import { IFolderService } from '../../services/folders/IFolderService';

export const FOLDER_SERVICE =
  new InjectionToken<IFolderService>('FOLDER_SERVICE');
