import { InjectionToken } from '@angular/core';
import { IPictureService } from '../../services/pictures/IPictureService';

export const PICTURE_SERVICE =
  new InjectionToken<IPictureService>('PICTURE_SERVICE');
