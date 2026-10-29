# luketurp.github.io

TEConnect demo: tokenize a card via manual entry, Apple Pay, or Google Pay using
`@magensa/te-connect` and `@magensa/te-connect-react`.

## Layout

| Path | What it is |
| --- | --- |
| `src/` | React app source |
| `public/` | Files copied as-is into the build: `_config.yml`, `.well-known/` (Apple Pay domain verification), `robots.txt` |
| `vendor/` | TEConnect library tarballs (see below) |
| `docs/` | **Build output.** GitHub Pages serves `main` → `/docs`. Don't edit by hand. |

## Scripts

```sh
npm ci
npm run dev          # local dev server
npm run build        # build to docs/ (frames from .env)
npm run build:pilot  # build to docs/ (frames from .env.pilot)
npm run preview      # serve docs/ locally
```

## Deploying

1. Branch from `main`, make changes in `src/` (or `public/`).
2. `npm run build` (or `npm run build:pilot` for the pilot host).
3. Commit the source **and** `docs/` together, push, open a PR against `main`.
4. Merging the PR deploys `docs/`.

## TEConnect frame host

`VITE_TEC_BASE_URL` is passed to `createTEConnect` as `frameBaseUrl`.

- `.env` (default build): `https://teconnectdemo.magensa.dev`
- `.env.pilot` (`build:pilot`): `https://mppg.magensa.net/TEC-Pilot`

Leave it empty to use the production host built into the library.

## TEConnect packages

`@magensa/te-connect` 1.5.1 and `@magensa/te-connect-react` 1.5.0 are installed from
`vendor/*.tgz`, packed from the local te-connect workspace (not yet on npm), with source
maps removed. To update: rebuild the package, `npm pack` from its `dist/`, remove the
`.map` files, copy the `.tgz` into `vendor/`, and reinstall it so `package-lock.json` gets
the new checksum.

Apple Pay and Google Pay need HTTPS and a registered domain, so wallet buttons
generally won't appear on `localhost`.
