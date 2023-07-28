/* eslint-disable */

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type {DefineComponent} from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'html2pdf.js' {}

declare module '*.svg' {

  import { VNode } from 'vue';

  // DON'T DECLARE THIS INSIDE GLOBAL MODULE
  type Svg = VNode;

  const content: Svg;
  export default content;
}
