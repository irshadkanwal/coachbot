// react-app-env.d.ts
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Extending React's HTMLAttributes to include 'name' for div elements
    name?: string;
  }
}