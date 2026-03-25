import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

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
  protected readonly iconPath = '/footprints.svg';

  readonly color = input<string>();
}

