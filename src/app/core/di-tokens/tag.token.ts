import { InjectionToken } from '@angular/core';
import { ITagService } from '../../services/tags/ITagService';

export const TAG_SERVICE =
  new InjectionToken<ITagService>('TAG_SERVICE');
