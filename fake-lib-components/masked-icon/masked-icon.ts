import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

export class MaskedIcon extends LitElement {
  @property({ type: String, reflect: true })
  accessor src = '';

  @property({ type: String, reflect: true })
  accessor color = '';

  static override styles = css`
    :host {
      --masked-icon-width: clamp(16rem, 82vmin, 30rem);
      display: inline-block;
      line-height: 0;
      max-width: 100%;
      box-sizing: border-box;
    }

    .silhouette {
      display: block;
      width: var(--masked-icon-width);
      max-width: 100%;
      margin-inline: auto;
      aspect-ratio: 1089 / 1280;
      box-sizing: border-box;
      mask-repeat: no-repeat;
      mask-position: center;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      -webkit-mask-size: contain;
    }
  `;

  override render() {
    const url = `url('${this.src}')`;

    return html`
      <span
        class="silhouette"
        style=${styleMap({
          backgroundColor: this.color,
          WebkitMaskImage: url,
          maskImage: url,
          WebkitMaskSourceType: 'alpha',
          maskMode: 'alpha',
        })}
        aria-hidden="true"
      ></span>
    `;
  }
}
