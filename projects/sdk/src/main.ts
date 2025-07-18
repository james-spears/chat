import { createApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { App } from './app/app';
import { createCustomElement } from '@angular/elements';
import { Widget } from '@projects/widget';
import {
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';

(async () => {
  try {
    const app = await createApplication({
      providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
      ],
    }); // Or use bootstrapApplication if you have a main app
    const WidgetElement = createCustomElement(Widget, {
      injector: app.injector,
    });
    customElements.define('chat-widget', WidgetElement);

    if (document) {
      const chatWidget = document.createElement('chat-widget');
      document.body.append(chatWidget);
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }
})();

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));
