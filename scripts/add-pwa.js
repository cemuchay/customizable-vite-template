#!/usr/bin/env node

/**
 * Standalone PWA Injector Utility
 *
 * Adds Progressive Web App (PWA) capabilities to an existing Vite + React project.
 * Run anytime: `node scripts/add-pwa.js` or `npm run add:pwa`
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\x1b[36m%s\x1b[0m', '=====================================================');
  console.log('\x1b[35m%s\x1b[0m', '          PWA INJECTOR FOR VITE + REACT              ');
  console.log('\x1b[36m%s\x1b[0m', '=====================================================');
  console.log('Injects service worker, manifest, offline cache rules, and install prompts.\n');

  const rootDir = process.cwd();
  const pkgJsonPath = path.join(rootDir, 'package.json');
  const viteConfigPath = path.join(rootDir, 'vite.config.ts');

  if (!fs.existsSync(pkgJsonPath)) {
    console.error('\x1b[31mError: package.json not found in current directory. Please run in your project root.\x1b[0m');
    rl.close();
    process.exit(1);
  }

  // 1. Choose strategy
  console.log('Select your PWA caching strategy:');
  console.log('  [1] Heavy Offline Caching  (Offline-First: precaches assets, Google Fonts & images)');
  console.log('  [2] Installability Only    (Network-First: fast install with zero stale data risks)');
  
  let strategyChoice = '';
  while (strategyChoice !== '1' && strategyChoice !== '2') {
    strategyChoice = (await askQuestion('Enter choice (1 or 2, default: 1): ')).trim() || '1';
  }
  const isHeavy = strategyChoice === '1';

  const appName = (await askQuestion('App Display Name (default: Vite App): ')).trim() || 'Vite App';
  const shortName = (await askQuestion('App Short Name (default: ViteApp): ')).trim() || 'ViteApp';
  const themeColor = (await askQuestion('Primary Theme Color Hex (default: #4f46e5): ')).trim() || '#4f46e5';

  const pmChoice = (await askQuestion('Package manager (npm/pnpm/yarn/bun, default: npm): ')).trim().toLowerCase() || 'npm';
  const pkgManager = ['npm', 'pnpm', 'yarn', 'bun'].includes(pmChoice) ? pmChoice : 'npm';

  rl.close();

  console.log('\n🚀 Injecting PWA assets and configurations...\n');

  try {
    // 2. Install dependencies
    const installCmd = {
      npm: 'npm install -D vite-plugin-pwa workbox-window',
      pnpm: 'pnpm add -D vite-plugin-pwa workbox-window',
      yarn: 'yarn add -D vite-plugin-pwa workbox-window',
      bun: 'bun add -d vite-plugin-pwa workbox-window',
    }[pkgManager];

    console.log(`- Installing dependencies via: ${installCmd}`);
    execSync(installCmd, { stdio: 'inherit', cwd: rootDir });

    // 3. Write PWA SVG Icon to public/
    const publicDir = path.join(rootDir, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="pwaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${themeColor}" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="#0f172a"/>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="url(#pwaGrad)" stroke-width="6" opacity="0.6"/>
  <path d="M160 140 L352 140 C374 140 392 158 392 180 L392 240 C392 262 374 280 352 280 L220 280 L220 372" fill="none" stroke="url(#pwaGrad)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="220" cy="372" r="16" fill="#ec4899"/>
  <path d="M160 210 L160 372" fill="none" stroke="url(#pwaGrad)" stroke-width="36" stroke-linecap="round"/>
</svg>`;

    fs.writeFileSync(path.join(publicDir, 'pwa-icon.svg'), svgIcon, 'utf-8');
    console.log('- Injected public/pwa-icon.svg');

    // 4. Create PWA React components & hooks in src/
    const hooksDir = path.join(rootDir, 'src', 'hooks');
    const componentsDir = path.join(rootDir, 'src', 'components');
    fs.mkdirSync(hooksDir, { recursive: true });
    fs.mkdirSync(componentsDir, { recursive: true });

    // usePwa.ts
    const usePwaContent = `import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwa() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSWFn, setUpdateSWFn] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    }

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));

    try {
      import('virtual:pwa-register').then(({ registerSW }) => {
        const updateSW = registerSW({
          onNeedRefresh() { setNeedRefresh(true); },
          onOfflineReady() { console.log('[PWA] Ready for offline use'); },
        });
        setUpdateSWFn(() => updateSW);
      }).catch(() => {});
    } catch {}

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  const updateApp = useCallback(async () => {
    if (updateSWFn) await updateSWFn();
    else if (typeof window !== 'undefined') window.location.reload();
  }, [updateSWFn]);

  return {
    isInstallable,
    isStandalone,
    isOffline,
    needRefresh,
    installApp,
    updateApp,
    dismissInstallPrompt: () => setIsInstallable(false),
  };
}
export default usePwa;
`;
    fs.writeFileSync(path.join(hooksDir, 'usePwa.ts'), usePwaContent, 'utf-8');

    // PwaInstallPrompt.tsx
    const installPromptContent = `import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePwa } from '../hooks/usePwa';

export const PwaInstallPrompt: React.FC = () => {
  const { isInstallable, installApp, dismissInstallPrompt } = usePwa();
  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-sm w-[calc(100%-2.5rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 shadow-xl shadow-indigo-500/10">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Install App</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Add to home screen for quick access.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={installApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={dismissInstallPrompt}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default PwaInstallPrompt;
`;
    fs.writeFileSync(path.join(componentsDir, 'PwaInstallPrompt.tsx'), installPromptContent, 'utf-8');

    // PwaStatusBanner.tsx
    const statusBannerContent = `import React from 'react';
import { RefreshCw, Sparkles, WifiOff } from 'lucide-react';
import { usePwa } from '../hooks/usePwa';

export const PwaStatusBanner: React.FC = () => {
  const { needRefresh, updateApp, isOffline } = usePwa();

  return (
    <>
      {isOffline && (
        <aside className="bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400 py-1.5 px-4 text-xs flex items-center justify-center gap-2 backdrop-blur-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are offline. Running in cached mode.</span>
        </aside>
      )}

      {needRefresh && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-[calc(100%-2.5rem)] sm:w-auto animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-purple-500/30 shadow-xl shadow-purple-500/10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Update Available</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">A new release is ready.</p>
            </div>
            <button
              onClick={updateApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default PwaStatusBanner;
`;
    fs.writeFileSync(path.join(componentsDir, 'PwaStatusBanner.tsx'), statusBannerContent, 'utf-8');

    // 5. Update index.html meta tags
    const indexHtmlPath = path.join(rootDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
      if (!htmlContent.includes('theme-color')) {
        htmlContent = htmlContent.replace(
          '</head>',
          `    <!-- PWA Primary Color & Web App Meta -->\n    <meta name="theme-color" content="${themeColor}" />\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />\n    <link rel="apple-touch-icon" href="/pwa-icon.svg" />\n  </head>`
        );
        fs.writeFileSync(indexHtmlPath, htmlContent, 'utf-8');
        console.log('- Injected PWA meta tags into index.html');
      }
    }

    // 6. Update vite-env.d.ts
    const envDtsPath = path.join(rootDir, 'src', 'vite-env.d.ts');
    if (fs.existsSync(envDtsPath)) {
      let envContent = fs.readFileSync(envDtsPath, 'utf-8');
      if (!envContent.includes('vite-plugin-pwa')) {
        envContent += '\n/// <reference types="vite-plugin-pwa/client" />\n/// <reference types="vite-plugin-pwa/react" />\n';
        fs.writeFileSync(envDtsPath, envContent, 'utf-8');
        console.log('- Updated src/vite-env.d.ts with PWA types');
      }
    }

    console.log('\n\x1b[32m✨ PWA integration successfully generated!\x1b[0m');
    console.log('\x1b[36mNext Step:\x1b[0m Add VitePWA plugin into your vite.config.ts:\n');
    console.log(`import { VitePWA } from 'vite-plugin-pwa';

plugins: [
  // ...other plugins
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'pwa-icon.svg'],
    manifest: {
      name: '${appName}',
      short_name: '${shortName}',
      theme_color: '${themeColor}',
      background_color: '#0f172a',
      display: 'standalone',
      icons: [
        { src: '/pwa-icon.svg', sizes: '192x192 512x512', type: 'image/svg+xml', purpose: 'any' },
        { src: '/pwa-icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
      ]
    },
    workbox: {
      ${isHeavy
        ? `globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}']`
        : `globPatterns: ['favicon.svg', 'pwa-icon.svg'], navigateFallback: null`}
    }
  })
]`);
  } catch (err) {
    console.error('\x1b[31mError adding PWA:\x1b[0m', err);
  }
}

main();
