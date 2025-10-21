/// <reference types="vite/client" />

// FIX: Manually declare `process` to work around a potential environment issue
// where the 'vite/client' type definitions are not being found.
declare var process: {
  env: {
    API_KEY?: string;
    [key: string]: string | undefined;
  }
};