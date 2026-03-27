import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { FootprintComponent } from '../../shared/components/footprint/footprint.component';
import { TrafficLightComponent } from '../../shared/components/traffic-light/traffic-light.component';
import type { FootSide } from '../../core/services/game/game.service';
import { GameService } from '../../core/services/game/game.service';
import { PlayerService } from '../../core/services/player/player.service';

/** Keyboard key mapped to left movement. */
const KEY_ARROW_LEFT = 'ArrowLeft';
/** Keyboard key mapped to right movement. */
const KEY_ARROW_RIGHT = 'ArrowRight';

/**
 * Game view: layout, navigation and input; delegates rules to {@link GameService}.
 */
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TrafficLightComponent, FootprintComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [GameService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly router = inject(Router);
  /** Player profile and scores for the template. */
  protected readonly player = inject(PlayerService);
  /** Traffic phases, scoring and audio ramp. */
  protected readonly game = inject(GameService);

  /**
   * Returns to the menu view and persists progress.
   */
  protected goToMenu(): void {
    this.player.saveProgress();
    void this.router.navigate(['/']);
  }

  protected moveLeft(): void {
    this.game.moveLeft();
  }

  protected moveRight(): void {
    this.game.moveRight();
  }

  protected footColor(side: FootSide): string {
    return this.game.footColor(side);
  }

  /**
   * Handles keyboard movement controls.
   *
   * @param event Browser keyboard event.
   */
  @HostListener('window:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === KEY_ARROW_LEFT) {
      event.preventDefault();
      this.moveLeft();
      return;
    }
    if (event.key === KEY_ARROW_RIGHT) {
      event.preventDefault();
      this.moveRight();
    }
  }
}
