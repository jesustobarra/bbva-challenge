import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly player = inject(PlayerService);

  protected readonly name = signal(this.player.name());

  protected onInput(ev: Event): void {
    const d = (ev as CustomEvent<string>).detail;
    this.name.set(typeof d === 'string' ? d : '');
  }

  protected acceder(): void {
    if (!this.hasName()) {
      return;
    }
    this.player.prepareForGame(this.name());
    void this.router.navigate(['/game']);
  }

  protected hasName(): boolean {
    return this.name().trim().length > 0;
  }

  protected errors(): Record<string, boolean> | null {
    return this.hasName() ? null : { required: true };
  }
}
