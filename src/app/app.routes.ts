import { Routes } from '@angular/router';
import { gameGuard } from './core/guards/game.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./features/game/game.component').then((m) => m.GameComponent),
    canActivate: [gameGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
