# Cataas Control Panel 🐱

Cataas Control Panel is a Vue 3 frontend for the super cute [Cat as a Service](https://cataas.com/) project. 😻

Cat as a Service is a REST API to spread peace and love (or not) thanks to cats. 😼

Check out the Cataas Control Panel at [cataas.edrw.dev](https://cataas.edrw.dev)!

## Features

- [x] Fetch random cat images
- [x] Modify cat images by adding text, filters, and more
- [ ] Save your favorite cat images 🚧
- [ ] Share cat images with your friends
- [ ] Search for cat images by Tag

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
