# Capsho App

## What works?

- [x] [Vue 3](https://vuejs.org/guide/introduction.html)
- [x] [Quasar Framework](https://quasar.dev/)
- [x] [Composition API](https://composition-api.vuejs.org/)
- [x] [SFC \<script setup> sugar](https://v3.vuejs.org/api/sfc-script-setup.html)
- [x] [Vue router](https://next.router.vuejs.org/)
- [x] [Vue Modular Architecture](https://www.youtube.com/watch?v=iuyzO2QkY7A)
- [x] [Pinia State Management](https://pinia.vuejs.org/)
- [x] [Typescript](https://www.typescriptlang.org/)
- [x] [Composable](https://vuejs.org/guide/reusability/composables.html)
- [x] [Reusable components](https://vueschool.io/lessons/vue-3-reusable-components-with-props)
- [x] Linter [ESLint](https://eslint.vuejs.org/)
- [ ] Unit test ([Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro)) (not complete)
- [x] [Yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
- [x] [Monorepo & CI/CD with Turborepo](https://turborepo.org/)
- [x] [Vercel](https://vercel.com/?utm_source=turborepo.org&utm_medium=referral&utm_campaign=docs-link)
- [x] [Docker](https://docs.docker.com/compose/)
- [x] [Firebase](https://firebase.google.com/docs/web/setup)

## Getting started

#### App manages packages from within a single monorepo (using [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/))

```shell script
# To install dependencies
yarn install

# To start the main project (in an isolated environment, runs on port 8080)
docker-compose up -d

# To install package with docker
docker-compose exec quasar yarn add <package-name>

# or it can be started using quasar cli (runs on port 8080)
yarn serve:quasar

# To start the social-capsho (runs on port 4000)
yarn serve:ui

# To build dist
yarn build

# To run frontend unit tests
yarn test:ui

# Adding Dependencies
# to the root directory
yarn add <package name> with -W flag
 
# to workspaces
yarn workspace <workspace name> add <package name>

# Examples
# adds turbo to the root as a dev dependency
yarn add turbo -DW

# adds firebase to main capsho quasar app
yarn workspace capsho-app-quasar add firebase

```

## Important*</span>

### For development use [dummy-api.js](./apps/capsho-app/src/services/dummy-api.js)

- Make sure in [apps/capsho-app/src/stores/index.ts](./apps/capsho-app/src/stores/index.ts)  
[dummy-api.js](./apps/capsho-app/src/services/dummy-api.js) is imported  
and comment out import of [openai.js](./apps/capsho-app/src/services/openai.js) on line 4
```typescript
import { store } from 'quasar/wrappers'
import { createPinia, PiniaPluginContext } from 'pinia'
import fbServices from 'src/services/firebase/index'
// import * as cloudFunctions from 'src/services/episode-drafts.js'
import * as cloudFunctions from 'src/services/dummy-api.js' // use dummy api in dev
```

## App has two workspaces (capsho-app & social-capsho)

### Capsho-app is the main and runs at [http://localhost:8080](http://localhost:8080)

#### Application structure

```bash
# Application structure is not updated, explore files from the code
apps/                                                         // apps
  L capsho-app
    L public
    L src/
      L assets/
      L boot/
      L components/
        L _globals.js                                         // global components registration
      L composables
        L fileList.js
        L useAuth.js                                          // firebase authenticated user with observer
    L useCredits.ts                                           // user's data from firestore db
    L useNotification.ts                                      // user's emails, captions, .etc
        L usePricing.ts
        L useSubscription.ts
      L config/
        L index.ts                                            // conditional env variables
      L css/
      L helpers/
      L layouts/
        L AppHeader.vue
        L MainLayout.vue                                      // App's main layout - navbar, footer
      L models/
      L modules/                                              // each module has routes, pages, components, vuex store
        L auth/
        L example/
        L payment/
        L podcast/
        L profile/
      L pages/                                                // basic pages that doesn't require authentication
      L router/
        L index.js                                            // main router
        L routes.js                                           // routes from modules nested here
      L services/
        L firebase/
        L app-error-service.ts
        L dummy-api.js
        L episode-drafts.js
        L payment.js
      L stores/                                                
        L cht-templates/                                       
        L auth-store.ts
        L auth-store-state-types.ts
        L data.json
        L folder-state-types.ts
        L folder-store.ts
        L index.ts
        L onBoarding-store.ts
        L store-flag.d.ts
        L upload-podcast.ts
        L upload-podcast-state-types.ts
      L utils/
        App.vue
        index.template.html                                                      
```

## Git commits

### Capitalize your commits (strongly recommended)

### Arlo's git notation
| Prefix | Meaning                       |
|--------|-------------------------------|
| F      | Feature                       |
| B      | Bug Fix                       |
| !!!    | Non-provable refactoring      |
| c      | Comment only                  |
| t      | Test only                     |
| r      | Provable (manual) refactoring |
| a      | Automated formatting          |
| d      | Documentation                 |
