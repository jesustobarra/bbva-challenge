import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { FootprintComponent } from '../../shared/components/footprint/footprint.component';
import { TrafficLightComponent } from '../../shared/components/traffic-light/traffic-light.component';
import { PlayerService } from '../../core/services/player.service';

/** Duration of the red light phase in milliseconds. */
const RED_LIGHT_MS = 3000;
/** Base duration of the green light phase in milliseconds. */
const GREEN_LIGHT_BASE_MS = 10000;
/** Green light reduction per score point in milliseconds. */
const GREEN_LIGHT_SCORE_STEP_MS = 100;
/** Lower bound for the green light duration in milliseconds. */
const GREEN_LIGHT_MIN_MS = 2000;
/** Absolute random jitter range for green light duration in milliseconds. */
const GREEN_LIGHT_JITTER_RANGE_MS = 1500;
/** Number of possible integer jitter values in range [-R, +R]. */
const GREEN_LIGHT_JITTER_SPAN_MS = GREEN_LIGHT_JITTER_RANGE_MS * 2 + 1;
/** Score value applied when the player moves on red light. */
const SCORE_RESET = 0;
/** Score delta for a valid move. */
const SCORE_STEP_UP = 1;
/** Score delta for repeating the same foot consecutively. */
const SCORE_STEP_DOWN = -1;
/** Color token used when traffic light is red. */
const TRAFFIC_LIGHT_RED = 'red';
/** Color token used when traffic light is green. */
const TRAFFIC_LIGHT_GREEN = 'green';
/** Active footprint color. */
const FOOTPRINT_DEFAULT = '#0f172a';
/** Keyboard key mapped to left movement. */
const KEY_ARROW_LEFT = 'ArrowLeft';
/** Keyboard key mapped to right movement. */
const KEY_ARROW_RIGHT = 'ArrowRight';

/** Muted footprint color for invalid/non-active side. */
const FOOTPRINT_MUTED = '#94a3b8';

/** Supported foot sides for movement and highlighting logic. */
type FootSide = 'left' | 'right';

/**
 * Main game screen that controls turns, movement and score.
 */
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TrafficLightComponent, FootprintComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  /** Angular destroy reference used to register cleanup logic. */
  private readonly destroyRef = inject(DestroyRef);
  /** Router service used for navigation between game and home. */
  private readonly router = inject(Router);
  /** Player state and persistence service. */
  protected readonly player = inject(PlayerService);
  /** Current timer id controlling traffic light phase transitions. */
  private timeoutId: ReturnType<typeof setTimeout> | undefined;
  /** Last foot used by the player, `null` before first valid step. */
  private lastFoot: FootSide | null = null;

  /** Reactive current traffic light color token. */
  protected readonly trafficLight = signal<string>(TRAFFIC_LIGHT_RED);

  /**
   * Sets up cleanup handlers and starts the traffic light loop.
   */
  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timeoutId !== undefined) {
        clearTimeout(this.timeoutId);
      }
      this.player.saveProgress();
    });
    this.scheduleNextPhase();
  }

  /**
   * Returns to the menu view and persists progress.
   */
  protected goToMenu(): void {
    this.player.saveProgress();
    void this.router.navigate(['/']);
  }

  /**
   * Schedules the next red/green phase transition.
   */
  private scheduleNextPhase(): void {
    const isRed = this.trafficLight() === TRAFFIC_LIGHT_RED;
    const delayMs = isRed ? RED_LIGHT_MS : this.greenLightDurationMs(this.player.score());
    this.timeoutId = setTimeout(() => {
      this.trafficLight.update((c) => {
        const next = c === TRAFFIC_LIGHT_RED ? TRAFFIC_LIGHT_GREEN : TRAFFIC_LIGHT_RED;
        if (next === TRAFFIC_LIGHT_GREEN) {
          this.lastFoot = null;
        }
        return next;
      });
      this.scheduleNextPhase();
    }, delayMs);
  }

  /**
   * Handles left movement action.
   */
  protected moveLeft(): void {
    this.onFoot('left');
  }

  /**
   * Handles right movement action.
   */
  protected moveRight(): void {
    this.onFoot('right');
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

  /**
   * Computes footprint visual state based on game status.
   *
   * @param side Foot side being rendered.
   * @returns Color for the requested side.
   */
  protected footColor(side: FootSide): string {
    if (this.trafficLight() === TRAFFIC_LIGHT_RED) {
      return FOOTPRINT_MUTED;
    }
    if (this.lastFoot === null) {
      return FOOTPRINT_DEFAULT;
    }
    const nextFoot: FootSide = this.lastFoot === 'left' ? 'right' : 'left';
    return side === nextFoot ? FOOTPRINT_DEFAULT : FOOTPRINT_MUTED;
  }

  /**
   * Applies game scoring rules for a foot movement.
   *
   * @param side Foot side used by the player.
   */
  private onFoot(side: FootSide): void {
    if (this.trafficLight() === TRAFFIC_LIGHT_RED) {
      this.player.setScore(SCORE_RESET);
      return;
    }
    if (this.lastFoot === null) {
      this.player.addScore(SCORE_STEP_UP);
      this.lastFoot = side;
      return;
    }
    if (this.lastFoot === side) {
      this.player.addScore(SCORE_STEP_DOWN);
    } else {
      this.player.addScore(SCORE_STEP_UP);
    }
    this.lastFoot = side;
  }

  /**
   * Returns a random jitter value for green light duration.
   *
   * @returns Integer jitter in milliseconds within configured range.
   */
  private randomGreenJitterMs(): number {
    return (
      Math.floor(Math.random() * GREEN_LIGHT_JITTER_SPAN_MS) - GREEN_LIGHT_JITTER_RANGE_MS
    );
  }

  /**
   * Computes green light duration based on current score and jitter.
   *
   * @param score Current player score.
   * @returns Green phase duration in milliseconds.
   */
  private greenLightDurationMs(score: number): number {
    const base = Math.max(
      GREEN_LIGHT_BASE_MS - score * GREEN_LIGHT_SCORE_STEP_MS,
      GREEN_LIGHT_MIN_MS,
    );
    return base + this.randomGreenJitterMs();
  }
}
