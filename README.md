# RedLightGreenLight (PWA)

## Requisitos

- Node.js y npm (este proyecto usa `npm@11.x`)

## Instalar dependencias

```bash
npm install
```

## Ejecutar en local

```bash
npm run start
```

Abre `http://localhost:4200/`.

## Ejecutar tests unitarios

```bash
npm test
```

Cobertura:

```bash
npm run test:coverage
```

## Construir (build)

```bash
npm run build
```

Genera los artefactos en `dist/`. Al ser el build por defecto una configuración de producción, el Service Worker se activa (útil para el modo offline/PWA).

## Librería Fake (custom elements)

La app usa componentes tipo *web component* (custom elements) con etiquetas como `<lib-input>`, `<lib-button>`, `<lib-masked-icon>`, `<lib-table>` y `<lib-table-row>`.

En lugar de depender de una librería externa, estas piezas están implementadas en `fake-lib-components/`, que “fingea” una UI externa para que el proyecto sea autocontenido y testeable.

## Storybook

[Storybook](https://storybook.js.org/) sirve para **ver y documentar componentes en aislamiento** (sin levantar toda la app). En este proyecto incluye sobre todo los *web components* de `fake-lib-components/` (historias `*.stories.ts`) y también componentes compartidos de `src/app/` que tengan su story.

**Arrancar el servidor de desarrollo**:

```bash
npm run storybook
```

## PWA / Modo offline

El modo offline (PWA) funciona mediante Service Worker usando `@angular/service-worker` y `ngsw-config.json`.

Pasos típicos para comprobarlo localmente:

1. Ejecuta un build:
   ```bash
   npm run build
   ```
2. Sirve el contenido generado en `dist/` con un servidor estático (por ejemplo: `npx http-server`).

## Persistencia de progreso

El progreso por jugador se persiste en `localStorage` con la key:

- `rlgl-player-saves`

Se guarda:

- `resumeScore`
- `maxPoints`

## Despliegue público

La app se puede desplegar como SPA estática (por ejemplo en Vercel, Netlify o GitHub Pages).

- Comando de build: `npm run build`
- Sirve el contenido generado por Angular en `dist/`.

