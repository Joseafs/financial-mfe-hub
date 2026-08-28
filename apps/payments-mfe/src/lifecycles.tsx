import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { RootComponent } from './root.component';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: RootComponent,
  domElementGetter: () => {
    const element = document.getElementById('mfe-root');

    if (!element) {
      throw new Error('[payments-mfe] #mfe-root not found');
    }

    return element;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
