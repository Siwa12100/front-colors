import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';

/**
 * Guard qui protège les routes réservées aux utilisateurs connectés.
 * Si pas de token JWT → redirection vers /login.
 */
export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
