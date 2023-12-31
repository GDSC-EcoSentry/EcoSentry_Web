import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';

export const homeGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.currentUser$.pipe(
    map(auth => {
      if (auth) {
        router.navigate(['']);
        return false;
      } 
      else{
        return true;
      }
    })
  );
};
