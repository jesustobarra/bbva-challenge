import { CUSTOM_ELEMENTS_SCHEMA, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FootprintComponent } from '../../shared/components/footprint/footprint.component';
import { TrafficLightComponent } from '../../shared/components/traffic-light/traffic-light.component';
import { PlayerService } from '../../core/services/player.service';

const RED_LIGHT_MS = 3000;

const FOOTPRINT_MUTED = '#94a3b8';

type FootSide = 'left' | 'right';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TrafficLightComponent, FootprintComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  protected readonly player = inject(PlayerService);
  private timeoutId: ReturnType<typeof setTimeout> | undefined;
  private lastFoot: FootSide | null = null;

  protected readonly semaforo = signal<string>('red');

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timeoutId !== undefined) {
        clearTimeout(this.timeoutId);
      }
      this.player.saveProgress();
    });
    this.scheduleNextPhase();
  }

  protected goToMenu(): void {
    this.player.saveProgress();
    void this.router.navigate(['/']);
  }

  private scheduleNextPhase(): void {
    const isRed = this.semaforo() === 'red';
    const delayMs = isRed ? RED_LIGHT_MS : this.greenLightDurationMs(this.player.score());
    this.timeoutId = setTimeout(() => {
      this.semaforo.update((c) => {
        const next = c === 'red' ? 'green' : 'red';
        if (next === 'green') {
          this.lastFoot = null;
        }
        return next;
      });
      this.scheduleNextPhase();
    }, delayMs);
  }

  protected moveLeft(): void {
    this.onFoot('left');
  }

  protected moveRight(): void {
    this.onFoot('right');
  }

  protected footColor(side: FootSide): string {
    if (this.semaforo() === 'red') {
      return FOOTPRINT_MUTED;
    }
    if (this.lastFoot === null) {
      return '#0f172a';
    }
    const nextFoot: FootSide = this.lastFoot === 'left' ? 'right' : 'left';
    return side === nextFoot ? '#0f172a' : FOOTPRINT_MUTED;
  }

  private onFoot(side: FootSide): void {
    if (this.semaforo() === 'red') {
      this.player.setScore(0);
      return;
    }
    if (this.lastFoot === null) {
      this.player.addScore(1);
      this.lastFoot = side;
      return;
    }
    if (this.lastFoot === side) {
      this.player.addScore(-1);
    } else {
      this.player.addScore(1);
    }
    this.lastFoot = side;
  }

  private randomGreenJitterMs(): number {
    return Math.floor(Math.random() * 3001) - 1500;
  }

  private greenLightDurationMs(score: number): number {
    const base = Math.max(10000 - score * 100, 2000);
    return base + this.randomGreenJitterMs();
  }
}
