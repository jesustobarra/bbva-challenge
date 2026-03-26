import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';

/**
 * Home screen where the player enters a name and starts the game.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);
  /** Player service used to initialize the session. */
  private readonly player = inject(PlayerService);

  /** Local reactive player name bound to the input component. */
  protected readonly name = signal(this.player.name());

  /**
   * Syncs the local name signal from custom input events.
   *
   * @param event Input custom event carrying the entered string value.
   */
  protected onInput(event: Event): void {
    const detail = (event as CustomEvent<string>).detail;
    this.name.set(typeof detail === 'string' ? detail : '');
  }

  /**
   * Starts a game session and redirects to the game view.
   */
  protected enterGame(): void {
    if (!this.hasName()) {
      return;
    }
    this.player.prepareForGame(this.name());
    void this.router.navigate(['/game']);
  }

  /**
   * Returns true when the entered name is not empty.
   *
   * @returns `true` when the name has non-whitespace characters.
   */
  protected hasName(): boolean {
    return this.name().trim().length > 0;
  }

  /**
   * Returns validation errors for the name input.
   *
   * @returns Validation map or `null` when input is valid.
   */
  protected errors(): Record<string, boolean> | null {
    return this.hasName() ? null : { required: true };
  }
}
