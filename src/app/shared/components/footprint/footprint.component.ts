import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

/**
 * Renders a footprint icon with configurable color.
 */
@Component({
  selector: 'app-footprint',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './footprint.component.scss',
  template: `
    <lib-masked-icon
      [attr.src]="iconPath"
      [attr.color]="color()"
      aria-hidden="true"
    />
  `,
})
export class FootprintComponent {
  /** Static asset path for the footprint icon. */
  protected readonly iconPath = '/assets/footprints.svg';

  /** Color applied to the rendered icon. */
  readonly color = input<string>();
}

