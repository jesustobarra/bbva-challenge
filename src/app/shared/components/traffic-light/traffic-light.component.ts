import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

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
  protected readonly iconPath = '/308345.svg';

  readonly color = input<string>();
  readonly ariaLabel = input<string | undefined>(undefined);
}
