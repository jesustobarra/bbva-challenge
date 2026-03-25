import { defineCustomElements } from '../fake-lib-components/register-custom-elements';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

defineCustomElements();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
