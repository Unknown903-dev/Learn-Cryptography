# Learn Crypto web app

This directory contains the React/Vite application for
[Learn Crypto](https://learncrypto.z3rø.com). For the lesson catalog, project
overview, structure, and deployment notes, see the
[repository README](../README.md).

## Development

```bash
npm ci
npm run dev
```

Vite normally serves the app at [http://localhost:5173](http://localhost:5173).

Before committing changes, run:

```bash
npm run lint
npm run build
npm audit
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the static application into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the source tree |

## Dependency security

Use `npm ci` so local and deployment installs follow `package-lock.json`.
The `minimatch` override in `package.json` selects the patched version 11 for
ESLint 10's dependency chain (GHSA-g3hv-75wg-m249). Remove the override once
upstream dependencies require a patched version directly, and rerun lint,
build, and audit after changing it.

Deployment security headers are defined in [`public/_headers`](public/_headers).
The app is educational and client-side; its simplified cryptographic examples
must not be reused as production security code.
