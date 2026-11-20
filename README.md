This repository is a scientific product and is not official communication of the National Oceanic and Atmospheric Administration, or the United States Department of Commerce. All NOAA GitHub project code is provided on an ‘as is’ basis and the user assumes responsibility for its use. Any claims against the Department of Commerce or Department of Commerce bureaus stemming from the use of this GitHub project will be governed by all applicable Federal law. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by the Department of Commerce. The Department of Commerce seal and logo, or the seal and logo of a DOC bureau, shall not be used in any manner to imply endorsement of any commercial product or activity by DOC or the United States Government.

# EMMET UI Prototype

A React and TypeScript starter interface powered by Vite. Unit tests use Jest
and React Testing Library. UI components and base styles use the U.S. Web
Design System (USWDS), installed through npm.

## Getting started

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

## Available scripts

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks the app and creates a production build in `dist/`.
- `npm test` runs the Jest test suite.
- `npm run test:watch` runs Jest in watch mode.

## GitHub Pages deployment

The `Deploy to GitHub Pages` workflow runs tests, builds the site, and deploys
it whenever changes are pushed to `main`. It can also be started manually from
the repository's Actions tab. In repository settings, set **Pages → Build and
deployment → Source** to **GitHub Actions**.

The deployed site is available at
<https://nefsc.github.io/FMRD-DIS-EMMET-UI-Prototype/>.

USWDS is added as the `@uswds/uswds` npm dependency. Its compiled stylesheet is
imported from the package in `src/main.tsx`; the UI uses USWDS button groups,
form controls, cards, tags, and tables.

## Example test data

The UI reads six contract-shaped sample batches from
[`src/data/fish-test-results.json`](./src/data/fish-test-results.json). Each
batch contains 100 submissions with `method`, species classification and
confidence, length in centimeters, and errors. The model and run are encoded in
`run_id` (for example, `batch_9942_cvision_run_1`).

Ground-truth species labels used for comparison are kept separately in
[`src/data/fish-test-labels.json`](./src/data/fish-test-labels.json), so the
results file keeps the API contract shape. Synthetic run durations are in
[`src/data/fish-run-metrics.json`](./src/data/fish-run-metrics.json); error rate
is calculated from submissions where the model could not make an inference.
Fail rate is calculated from incorrect predictions among successful
inferences. Each selected run displays PASS at 85% accuracy or higher,
otherwise it displays FAIL. Data is synthetic. The UI includes an administrator view with
fish-level results and separate Cvision and IM views with aggregate
correct/incorrect counts. The view switch is for prototyping and is not an
authentication or authorization mechanism.
