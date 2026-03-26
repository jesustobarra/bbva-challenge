import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { PlayerService } from '../services/player.service';

/**
 * Route guard that blocks the game route when there is no player name.
 */
export const gameGuard: CanActivateFn = () => {
  const player = inject(PlayerService);
  const router = inject(Router);
  if (player.hasName()) {
    return true;
  }
  return router.createUrlTree(['']);
};
