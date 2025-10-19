// The reference to 'vite/client' is commented out to resolve a 'Cannot find type definition file' error.
// This error typically occurs in environments where TypeScript's type resolution is misconfigured.
// The project does not currently use Vite-specific client-side features that require these types,
// so this change is safe. If features like typed asset imports are added, this line should be
// restored and the environment configuration fixed.
// /// <reference types="vite/client" />