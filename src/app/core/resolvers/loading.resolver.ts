import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { delay, of, tap } from 'rxjs';

export const loadingResolver: ResolveFn<boolean> = () => {
  const loaderService = inject(LoaderService);
  loaderService.show();
  return of(true).pipe(delay(1000), tap(() => loaderService.hide()));
};
