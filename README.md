# Custom Vite + React Starter Kit Template Generator

> A lightweight, minimalist, and resilient Vite template generator pre-configured with industry-standard frontend tools.

---

## ⚡ Quick Start: Create Your First Project (Step-by-Step)

Here is how you can spin up and test a sample project in under 2 minutes:

- **Step 1: Run the Generator**
  ```bash
  npx @chizalam/create-vite-app
  ```
  *(Or run `node setup.js` if cloned locally)*

- **Step 2: Answer the Prompts with Sample Values**
  - **Project Name**: `my-test-app` *(creates a new `./my-test-app` directory)*
  - **Tailwind CSS Version**: `4` *(or `3` for legacy config)*
  - **Include Authentication & Protected Routes?**: `y` *(includes Zustand auth store, demo accounts, and route guards)*
  - **Include React Router v7?**: `y`
  - **Include Testing (Vitest)?**: `y`
  - **Include Express Server?**: `y`
  - **Include ESLint + Prettier?**: `y`
  - **Include Vercel Deployment Config (vercel.json)?**: `y` *(includes SPA rewrite rules)*
  - **Initialize Git repo?**: `y`
  - **Select Package Manager**: `npm` *(or pnpm/yarn/bun)*
  - **Configure in-place?**: `n` *(choose `n` to create inside `./my-test-app`)*

- **Step 3: Navigate & Start the Dev Server**
  ```bash
  cd my-test-app
  npm install
  npm run dev
  ```

- **Step 4: Open in Browser**
  - Visit `http://localhost:5173` to explore your dashboard, test 1-click demo logins (`admin@example.com` or `user@example.com`), explore protected routes, trigger API retries, and switch themes.

---

## 🚀 Key Features Out-of-the-Box

The core engine is bootstrapped with high-performance, production-ready utilities:

- ⚡ **Vite + React 19 + TypeScript** for blazing-fast compilations.
- 🔐 **Authentication & Protected Routes**: Ready-to-use auth engine with persistent state (`localStorage`), role-based guards (`<ProtectedRoute>`), and 1-click **Demo Login** buttons for instant testing.
- 🛡️ **UI Error Boundary & Observability**: Built-in React Error Boundary fallback with "Return to Home", "Reload Page", and technical error diagnosis.
- 🧭 **404 Not Found Page**: Dedicated not-found view with seamless navigation back to safety.
- 📝 **Smart Error Logger (`logger.ts`)**: Intelligent deduplicating logging engine with a 60s sliding window cache to prevent log spam.
- 🌐 **Resilient Axios Engine (`api.ts`)**: Pre-configured client with 10s default timeouts, **automatic 3x retry** with exponential backoff + jitter for network/5xx failures, auth headers, and typed HTTP helpers.
- 💾 **Safe Storage Gateways (`storage.ts`)**: Resilient, type-safe gateways for `localStorage`, `sessionStorage`, and `IndexedDB` with centralized schema keys, auto JSON parsing, QuotaExceeded handling, and graceful in-memory fallbacks.
- 🐻 **Zustand** for persistent, lightweight global client state management.
- 🔄 **TanStack Query (React Query v5)** for server state synchronization and caching.
- ▲ **Vercel-Ready**: Pre-configured `vercel.json` with SPA catch-all rewrites preventing 404s on page refresh.
- 🎨 **Lucide React** for modern vector icons.
- 🛠️ **Developer Toolkits**: Comprehensive `.gitignore`, path aliases (`@/*`), and dark/light theme persistence.

---

## 🛠️ Interactive Configuration Options

Run the CLI wizard to customize your environment with:

1. **Tailwind CSS v4** (using the new CSS-first `@tailwindcss/vite` compiler) **or** **Tailwind CSS v3** (using traditional PostCSS configurations).
2. **Authentication & Protected Routes** with Zustand persisted store, login screen, and `<ProtectedRoute>` guards.
3. **React Router v7** Client Routing setup **or** a state-based tabbed Single Page App layout.
4. **Vitest + JSDOM + Testing Library** configured for instant automated unit & integration component tests.
5. **Express.js API Server** in TypeScript running concurrently using `tsx` watcher support and Vite reverse-proxy handlers.
6. **ESLint v9 Flat Config + Prettier** for standardized linting and automated formatting.
7. **Vercel Deployment Configuration (`vercel.json`)** for instant SPA deployment.

---

## 📂 Boilerplate File Architecture

Once setup finishes, your generated project follows this clean structure:

```
[your-project-dir]/
  ├── src/
  │   ├── components/
  │   │   ├── __tests__/        # Automated component unit specs (Vitest)
  │   │   ├── Dashboard.tsx     # Dashboard displaying Queries + Zustand actions
  │   │   ├── ErrorBoundary.tsx # UI Error Boundary with home redirection & recovery
  │   │   ├── Layout.tsx        # Sidebar, header with user avatar & sign-out menu
  │   │   ├── ProtectedRoute.tsx# Route guard with role-based access control
  │   │   ├── ThemeToggle.tsx   # Responsive dark mode toggle button
  │   │   └── ToastContainer.tsx# Self-dismissing slide-in notifications
  │   ├── hooks/
  │   │   └── useQueries.ts     # TanStack Query custom query & mutation hooks
  │   ├── pages/
  │   │   ├── ApiDemo.tsx       # Live playground for Axios retries, headers & errors
  │   │   ├── Docs.tsx          # Starter documentation
  │   │   ├── Login.tsx         # Login page with 1-click demo login buttons
  │   │   ├── NotFound.tsx      # 404 Not Found component with navigation
  │   │   └── Settings.tsx      # Protected application preferences
  │   ├── services/
  │   │   ├── api.ts            # Resilient Axios client (timeout, 3x retries, interceptors)
  │   │   ├── logger.ts         # Smart deduplicating error logger (TTL window)
  │   │   ├── toast.ts          # Toast notification manager
  │   │   ├── storageKeys.ts    # Centralized storage schema & key contracts
  │   │   ├── safeStorage.ts    # Safe localStorage & sessionStorage gateways
  │   │   ├── safeIndexedDB.ts  # Safe IndexedDB async gateway
  │   │   └── storage.ts        # Storage barrel exports
  │   ├── store/
  │   │   ├── useAuthStore.ts   # Zustand persisted authentication store
  │   │   └── useStore.ts       # Zustand global store configuration
  │   ├── App.tsx               # Master App routes routing wrapper
  │   ├── main.tsx              # App entrypoint injecting providers
  │   └── index.css             # Core styling stylesheet
  ├── server/                   # Express backend server (optional)
  │   └── index.ts
  ├── vercel.json               # Vercel SPA deployment rewrites (optional)
  ├── vite.config.ts            # Environment and proxy definitions
  ├── tsconfig.json             # TS compiling configurations
  ├── .gitignore                # Comprehensive environment & build ignore rules
  └── README.md                 # Customized usage documentation
```

---

## 🧪 Running Tests

If Vitest was selected during setup, execute tests using:

```bash
# Start vitest in interactive watch mode
npm run test

# Run tests once (e.g. for CI pipelines)
npm run test:run
```

---

## 🌐 Network Engine & Smart Logger Usage

### Using the Resilient API Engine
```typescript
import { http, api } from './services/api';

// 1. Typed convenience helper with automatic 3x retries
const data = await http.get<User>('/user/profile');

// 2. Custom per-request retry configuration
const response = await api.get('/heavy-calculation', {
  timeout: 15000,
  retry: 5,         // Retry up to 5 times
  retryDelay: 1000, // 1s base delay with exponential backoff
});
```

### Logging Errors without Spam
```typescript
import { logger } from './services/logger';

// Automatically deduplicates identical errors within 60s
logger.logError(new Error('Network heartbeat lost'));
```

### Global Toast Notifications
```typescript
import { toast } from './services/toast';

// 1. Basic alerts
toast.success('Project created successfully!');
toast.error('Failed to sync changes', { title: 'Network Error' });
toast.warning('Storage is almost full', { duration: 6000 });

// 2. Interactive action toast
toast.info('Item archived', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo action triggered'),
  },
});

// 3. Promise lifecycle tracking (Loading -> Success/Error)
await toast.promise(saveUserData(), {
  loading: 'Saving profile updates...',
  success: 'Profile updated!',
  error: (err) => `Failed to update: ${err.message}`,
});
```

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE details for info.
