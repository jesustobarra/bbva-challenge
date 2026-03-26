import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

/**
 * Renders the traffic light icon used by the game state.
 */
@Component({
  selector: 'app-traffic-light',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './traffic-light.component.scss',
  template: `
    <span role="img" [attr.aria-label]="ariaLabel() ?? null">
      <lib-masked-icon
        [attr.src]="iconPath"
        [attr.color]="color()"
        aria-hidden="true"
      />
    </span>
  `,
})
export class TrafficLightComponent {
  /** Static asset path for the traffic-light icon. */
  protected readonly iconPath = '/assets/images/traffic-light.svg';

  /** Current traffic-light color token. */
  readonly color = input<string>();
  /** Optional accessible label exposed on the wrapper element. */
  readonly ariaLabel = input<string | undefined>(undefined);
}
