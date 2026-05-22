# Custom Vite + React Starter Kit Template Generator

A lightweight, minimalist, and highly customizable Vite template generator pre-configured with industry-standard frontend tools.

Instead of forcing a static layout, this repository provides an interactive CLI setup script that constructs a custom stack based on your specifications, including options for modern styling, routing, testing, and a lightweight backend server.

---

## 🚀 Key Features Out-of-the-Box

The core engine is bootstrapped with high-performance, lightweight utilities:

- ⚡ **Vite + React + TypeScript** for rapid compilations.
- 🐻 **Zustand** for persistent, lightweight global client state management.
- 🔄 **TanStack Query (React Query v5)** for server state synchronization and client cache key management.
- 🌐 **Axios** client featuring pre-written request/response logging interceptors and authorization header mappings.
- 🎨 **Lucide React** for dynamic, high-quality vector icon assets.
- 🛠️ **Developer Toolkits**: Configured TypeScript configs (`tsconfig`), alias resolver mappings (`@/*` pointing to `src/*`), and a dark mode configuration default.

---

## 🛠️ Interactive Configuration Options

Run the CLI wizard to customize your environment with:

1. **Tailwind CSS v4** (using the new lightning-fast CSS-first `@tailwindcss/vite` compiler) **or** **Tailwind CSS v3** (using traditional PostCSS configurations).
2. **React Router v7** Client Routing setup **or** a state-based tabbed Single Page App layout.
3. **Vitest + JSDOM + Testing Library** configured for instant automated unit & integration component tests.
4. **Express.js API Server** in TypeScript running concurrently using `tsx` watcher support and Vite reverse-proxy handlers.

---

## ⚡ Getting Started

### Run via npx

You can run it instantly:

```bash
npx @chizalam/create-vite-app
```

### Run From Source

To run the setup wizard directly from the cloned repository:

```bash
node setup.js
```

### Step 2: Follow the Command Line Prompts

The wizard will prompt you for configuration details:

```
=====================================================
       VITE + REACT CUSTOM TEMPLATE BUILDER
=====================================================
Welcome! This CLI compiles a tailored minimalist Vite layout.

📦 Project Name (default: vite-app): dashboard-app
🎨 Tailwind CSS Version (3 or 4): 4
🚦 Include React Router v7? (y/n, default: y): y
🧪 Include Testing via Vitest + JSDOM? (y/n, default: y): y
🖥️  Include simple Express + TypeScript server? (y/n, default: y): y
📍 Configure in-place inside current directory? (y/n, default: y): y
```

> [!TIP]
> **In-Place Configuration (`y`)**: Compiles files directly inside the current workspace. Once completed, you can select the option to automatically delete the template cache files and the `setup.js` wizard script, leaving a clean project.
>
> **Separate Directory (`n`)**: Compiles files into a new subdirectory, keeping this generator repository intact for future setups.

### Step 3: Run the Application

Once dependencies are installed, start the development environment:

```bash
npm run dev
```

---

## 📂 Boilerplate File Architecture

Once setup finishes, the generated directory will follow this clean pattern:

```
[your-project-dir]/
  ├── src/
  │   ├── components/
  │   │   ├── __tests__/      # Automated component unit specs (Vitest)
  │   │   ├── Dashboard.tsx   # Dashboard displaying Queries + Zustand actions
  │   │   ├── Layout.tsx      # Sidebar, glassmorphism headers, and container grids
  │   │   ├── ThemeToggle.tsx # Responsive dark mode toggle button
  │   │   └── ToastContainer.tsx # Self-dismissing slide-in notifications
  │   ├── hooks/
  │   │   └── useQueries.ts   # TanStack Query custom query & mutation hooks
  │   ├── pages/              # Mapped routes (Dashboard, Settings, ApiDemo, Docs)
  │   ├── services/
  │   │   └── api.ts          # Central Axios configuration client
  │   ├── store/
  │   │   └── useStore.ts     # Zustand global store configuration
  │   ├── App.tsx             # Master App routes routing wrapper
  │   ├── main.tsx            # App entrypoint injecting providers
  │   └── index.css           # Core styling stylesheet
  ├── server/                 # Express backend server (optional)
  │   └── index.ts
  ├── vite.config.ts          # Environment and proxy definitions
  ├── tsconfig.json           # TS compiling configurations
  └── README.md               # Customized usage documentation
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

## 🔧 Extending the Boilerplate

### 1. Adding Global Client State (Zustand)

Open [src/store/useStore.ts](file:///c:/Users/cemuc/Documents/WEB%20PROJECTS/vite-template/src/store/useStore.ts) to define new variables and selector functions. The store persists values under `localStorage` keys automatically:

```typescript
interface AppState {
  credits: number;
  incrementCredits: () => void;
}

// Inside create store definition:
credits: 100,
incrementCredits: () => set((state) => ({ credits: state.credits + 1 }))
```

### 2. Modifying the API Endpoint & Queries

To request data from a new endpoint, add the handler inside [src/hooks/useQueries.ts](file:///c:/Users/cemuc/Documents/WEB%20PROJECTS/vite-template/src/hooks/useQueries.ts):

```typescript
export function useUserData() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await api.get("/user/profile");
      return response.data;
    },
  });
}
```

### 3. Setting Up a New Route (React Router v7)

If client-side routing is enabled, open [src/App.tsx](file:///c:/Users/cemuc/Documents/WEB%20PROJECTS/vite-template/src/App.tsx) and add a new route:

```tsx
<Route path="/profile" element={<ProfilePage />} />
```

Make sure to add the navigation link inside the header in [src/components/Layout.tsx](file:///c:/Users/cemuc/Documents/WEB%20PROJECTS/vite-template/src/components/Layout.tsx).

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE details for info.
