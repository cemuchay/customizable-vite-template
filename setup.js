#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.clear();
  console.log('\x1b[36m%s\x1b[0m', '=====================================================');
  console.log('\x1b[35m%s\x1b[0m', '       VITE + REACT CUSTOM TEMPLATE BUILDER        ');
  console.log('\x1b[36m%s\x1b[0m', '=====================================================');
  console.log('Welcome! This CLI compiles a tailored minimalist Vite layout.');
  console.log('');

  // 1. Inputs Gathering
  const projectName = (await askQuestion('📦 Project Name (default: vite-app): ')).trim() || 'vite-app';
  
  let tailwindChoice = '';
  while (tailwindChoice !== '3' && tailwindChoice !== '4') {
    tailwindChoice = (await askQuestion('🎨 Tailwind CSS Version (3 or 4): ')).trim();
    if (tailwindChoice !== '3' && tailwindChoice !== '4') {
      console.log('\x1b[31mError: Please enter either "3" or "4"\x1b[0m');
    }
  }

  const routerResponse = (await askQuestion('🚦 Include React Router v7? (y/n, default: y): ')).trim().toLowerCase();
  const includeRouter = routerResponse !== 'n';

  const testResponse = (await askQuestion('🧪 Include Testing via Vitest + JSDOM? (y/n, default: y): ')).trim().toLowerCase();
  const includeTesting = testResponse !== 'n';

  const serverResponse = (await askQuestion('🖥️  Include simple Express + TypeScript server? (y/n, default: y): ')).trim().toLowerCase();
  const includeServer = serverResponse !== 'n';

  const destinationResponse = (await askQuestion('📍 Configure in-place inside current directory? (y/n, default: y): ')).trim().toLowerCase();
  const inPlace = destinationResponse !== 'n';

  const targetDir = inPlace ? process.cwd() : path.join(process.cwd(), projectName);

  console.log('\n\x1b[36mConfiguring Stack Summary:\x1b[0m');
  console.log(`- Project Path:      ${targetDir}`);
  console.log(`- Tailwind CSS:      v${tailwindChoice}`);
  console.log(`- React Router v7:   ${includeRouter ? 'Yes' : 'No'}`);
  console.log(`- Testing (Vitest):  ${includeTesting ? 'Yes' : 'No'}`);
  console.log(`- Express Backend:   ${includeServer ? 'Yes' : 'No'}`);
  console.log('');

  const confirm = (await askQuestion('Proceed with generation? (y/n, default: y): ')).trim().toLowerCase();
  if (confirm === 'n') {
    console.log('\x1b[31mSetup cancelled.\x1b[0m');
    rl.close();
    return;
  }

  console.log('\n🚀 Starting scaffold assembly...');

  try {
    // 2. Directory Creation
    if (!inPlace && !fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const copyTemplate = (srcSubpath, destSubpath) => {
      const src = path.join(__dirname, 'templates', srcSubpath);
      const dest = path.join(targetDir, destSubpath);
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(src, dest, { recursive: true });
      }
    };

    // 3. Assemble Base files
    console.log('- Copying baseline template structures...');
    copyTemplate('base/index.html', 'index.html');
    copyTemplate('base/tsconfig.json', 'tsconfig.json');
    copyTemplate('base/tsconfig.app.json', 'tsconfig.app.json');
    copyTemplate('base/tsconfig.node.json', 'tsconfig.node.json');
    copyTemplate('base/src/vite-env.d.ts', 'src/vite-env.d.ts');
    copyTemplate('base/src/main.tsx', 'src/main.tsx');
    copyTemplate('base/src/services/api.ts', 'src/services/api.ts');
    copyTemplate('base/src/store/useStore.ts', 'src/store/useStore.ts');
    copyTemplate('base/src/hooks/useQueries.ts', 'src/hooks/useQueries.ts');
    copyTemplate('base/src/components/ThemeToggle.tsx', 'src/components/ThemeToggle.tsx');
    copyTemplate('base/src/components/ToastContainer.tsx', 'src/components/ToastContainer.tsx');
    copyTemplate('base/src/components/Dashboard.tsx', 'src/components/Dashboard.tsx');
    copyTemplate('base/src/components/Layout.tsx', 'src/components/Layout.tsx');
    
    // Copy base pages
    copyTemplate('base/src/pages/ApiDemo.tsx', 'src/pages/ApiDemo.tsx');
    copyTemplate('base/src/pages/Docs.tsx', 'src/pages/Docs.tsx');
    copyTemplate('base/src/pages/Settings.tsx', 'src/pages/Settings.tsx');

    // 4. Handle Styling Setup (Tailwind 3 vs 4)
    if (tailwindChoice === '4') {
      console.log('- Injecting Tailwind CSS v4 styling assets...');
      copyTemplate('tailwind4/src/index.css', 'src/index.css');
    } else {
      console.log('- Injecting Tailwind CSS v3 PostCSS parameters...');
      copyTemplate('tailwind3/src/index.css', 'src/index.css');
      copyTemplate('tailwind3/tailwind.config.js', 'tailwind.config.js');
      copyTemplate('tailwind3/postcss.config.js', 'postcss.config.js');
    }

    // 5. Handle Routing Setup
    if (includeRouter) {
      console.log('- Injecting React Router v7 routes...');
      copyTemplate('router/src/App.tsx', 'src/App.tsx');
    } else {
      console.log('- Injecting standard single-page app configuration...');
      copyTemplate('norouter/src/App.tsx', 'src/App.tsx');
    }

    // 6. Handle Testing Setup
    if (includeTesting) {
      console.log('- Loading Vitest config files and mock specs...');
      copyTemplate('vitest/src/test/setup.ts', 'src/test/setup.ts');
      copyTemplate('vitest/src/components/__tests__/ThemeToggle.test.tsx', 'src/components/__tests__/ThemeToggle.test.tsx');
      copyTemplate('vitest/src/components/__tests__/Dashboard.test.tsx', 'src/components/__tests__/Dashboard.test.tsx');
    }

    // 7. Handle Express Server Setup
    if (includeServer) {
      console.log('- Copying server modules...');
      copyTemplate('server/index.ts', 'server/index.ts');
    }

    // 8. Generate dynamic package.json
    console.log('- Compiling package.json metadata...');
    const packageJson = {
      name: projectName,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        "dev:client": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
      },
      dependencies: {
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
        "axios": "^1.7.9",
        "lucide-react": "^0.475.0",
        "zustand": "^5.0.3",
        "@tanstack/react-query": "^5.66.0"
      },
      devDependencies: {
        "vite": "^6.1.0",
        "@vitejs/plugin-react": "^4.3.4",
        "typescript": "^5.7.3",
        "@types/react": "^19.0.8",
        "@types/react-dom": "^19.0.3"
      }
    };

    // Inject routing dependencies
    if (includeRouter) {
      packageJson.dependencies["react-router"] = "^7.1.5";
    }

    // Inject Tailwind dependencies
    if (tailwindChoice === '4') {
      packageJson.devDependencies["tailwindcss"] = "^4.0.0";
      packageJson.devDependencies["@tailwindcss/vite"] = "^4.0.0";
    } else {
      packageJson.devDependencies["tailwindcss"] = "^3.4.17";
      packageJson.devDependencies["postcss"] = "^8.5.1";
      packageJson.devDependencies["autoprefixer"] = "^10.4.20";
    }

    // Inject testing dependencies
    if (includeTesting) {
      packageJson.scripts["test"] = "vitest";
      packageJson.scripts["test:run"] = "vitest run";
      packageJson.devDependencies["vitest"] = "^3.0.5";
      packageJson.devDependencies["jsdom"] = "^26.0.0";
      packageJson.devDependencies["@testing-library/react"] = "^16.2.0";
      packageJson.devDependencies["@testing-library/jest-dom"] = "^6.6.3";
    }

    // Inject server dependencies
    if (includeServer) {
      packageJson.scripts["server"] = "tsx watch server/index.ts";
      packageJson.scripts["dev"] = "concurrently \"npm run dev:client\" \"npm run server\"";
      packageJson.dependencies["express"] = "^4.21.2";
      packageJson.dependencies["cors"] = "^2.8.5";
      packageJson.devDependencies["tsx"] = "^4.19.2";
      packageJson.devDependencies["concurrently"] = "^9.1.2";
      packageJson.devDependencies["@types/express"] = "^5.0.0";
      packageJson.devDependencies["@types/cors"] = "^2.8.17";
    } else {
      packageJson.scripts["dev"] = "vite";
    }

    fs.writeFileSync(
      path.join(targetDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // 9. Generate dynamic vite.config.ts
    console.log('- Compiling vite.config.ts environment configuration...');
    let viteConfig = '';
    
    if (includeTesting) {
      viteConfig += '/// <reference types="vitest" />\n';
    }

    viteConfig += 'import { defineConfig } from \'vite\';\n';
    viteConfig += 'import react from \'@vitejs/plugin-react\';\n';
    
    if (tailwindChoice === '4') {
      viteConfig += 'import tailwindcss from \'@tailwindcss/vite\';\n';
    }

    viteConfig += '\n// https://vite.dev/config/\n';
    viteConfig += 'export default defineConfig({\n';
    viteConfig += '  plugins: [\n';
    viteConfig += '    react(),\n';
    
    if (tailwindChoice === '4') {
      viteConfig += '    tailwindcss(),\n';
    }
    
    viteConfig += '  ],\n';
    viteConfig += '  resolve: {\n';
    viteConfig += '    alias: {\n';
    viteConfig += '      \'@\': \'/src\',\n';
    viteConfig += '    },\n';
    viteConfig += '  },\n';

    if (includeServer) {
      viteConfig += '  server: {\n';
      viteConfig += '    proxy: {\n';
      viteConfig += '      \'/api\': {\n';
      viteConfig += '        target: \'http://localhost:5000\',\n';
      viteConfig += '        changeOrigin: true,\n';
      viteConfig += '      },\n';
      viteConfig += '    },\n';
      viteConfig += '  },\n';
    }

    if (includeTesting) {
      viteConfig += '  test: {\n';
      viteConfig += '    globals: true,\n';
      viteConfig += '    environment: \'jsdom\',\n';
      viteConfig += '    setupFiles: \'./src/test/setup.ts\',\n';
      viteConfig += '  },\n';
    }

    viteConfig += '});\n';

    fs.writeFileSync(
      path.join(targetDir, 'vite.config.ts'),
      viteConfig
    );

    // 10. Generate project README.md
    console.log('- Creating project specific README.md documentation...');
    let projectReadme = `# ${projectName}\n\n`;
    projectReadme += `This is a highly optimized, minimalist React SPA bootstrapped using Vite, TypeScript, and customized styling configurations.\n\n`;
    projectReadme += `## 🛠️ Stack Configuration\n\n`;
    projectReadme += `- **Styling**: Tailwind CSS v${tailwindChoice}\n`;
    projectReadme += `- **Routing**: ${includeRouter ? 'React Router v7 (Client Routing)' : 'None (State-based Navigation)'}\n`;
    projectReadme += `- **State Management**: Zustand (Persistent Local Store)\n`;
    projectReadme += `- **Data Fetching**: Axios client synced with TanStack Query (React Query)\n`;
    projectReadme += `- **Icons**: Lucide React\n`;
    projectReadme += `- **Testing**: ${includeTesting ? 'Vitest + Testing Library JSDOM' : 'None'}\n`;
    projectReadme += `- **Server**: ${includeServer ? 'Express Backend (Running via tsx watch)' : 'None'}\n\n`;
    projectReadme += `## 🚀 Getting Started\n\n`;
    projectReadme += `### 1. Install Dependencies\n\`\`\`bash\nnpm install\n\`\`\`\n\n`;
    projectReadme += `### 2. Run in Development Mode\n\`\`\`bash\nnpm run dev\n\`\`\`\n`;
    if (includeServer) {
      projectReadme += `This runs the frontend (Vite) and the backend (Express) concurrently.\n`;
    }
    projectReadme += `\n`;
    if (includeTesting) {
      projectReadme += `### 3. Run Automated Tests\n\`\`\`bash\nnpm run test\n\`\`\`\n\n`;
    }
    projectReadme += `### 4. Build for Production\n\`\`\`bash\nnpm run build\n\`\`\`\n\n`;
    projectReadme += `## 📂 Folder Breakdown\n\n`;
    projectReadme += `- \`src/components/\`: Core UI elements.\n`;
    projectReadme += `- \`src/services/\`: Axios instance containing logs/token interceptors (\`api.ts\`).\n`;
    projectReadme += `- \`src/store/\`: Global Zustand store settings.\n`;
    projectReadme += `- \`src/hooks/\`: TanStack Query fetchers and mutations.\n`;
    if (includeServer) {
      projectReadme += `- \`server/\`: Backend routes and Express launch instance.\n`;
    }
    if (includeTesting) {
      projectReadme += `- \`src/components/__tests__/\`: Unit test specs.\n`;
    }

    fs.writeFileSync(
      path.join(targetDir, 'README.md'),
      projectReadme
    );

    // 11. Cleanup setup templates (only if inPlace, to clean workspace)
    let cleanup = 'y';
    if (inPlace) {
      cleanup = (await askQuestion('🧹 Clean up setup generator files & templates? (y/n, default: y): ')).trim().toLowerCase();
    } else {
      cleanup = 'n'; // keep templates inside source generator repo
    }

    if (cleanup !== 'n') {
      console.log('- Cleaning setup artifacts and template source files...');
      try {
        fs.rmSync(path.join(targetDir, 'templates'), { recursive: true, force: true });
        // We defer self-deletion slightly to let execution finish cleanly
        setTimeout(() => {
          try {
            fs.unlinkSync(path.join(targetDir, 'setup.js'));
          } catch(e) {}
        }, 100);
      } catch (err) {
        console.warn('Warning: Could not remove template/setup files automatically.', err.message);
      }
    }

    console.log('\n\x1b[32m✔ Project successfully generated!\x1b[0m');

    const installResponse = (await askQuestion('📦 Install npm dependencies now? (y/n, default: y): ')).trim().toLowerCase();
    if (installResponse !== 'n') {
      console.log('\n📦 Running "npm install"... (This may take a minute)');
      execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
      console.log('\n\x1b[32m✔ Dependencies installed successfully!\x1b[0m');
    }

    console.log('\n🎉 Setup complete. Run the following to start:');
    if (!inPlace) {
      console.log(`\x1b[36mcd ${projectName}\x1b[0m`);
    }
    console.log('\x1b[36mnpm run dev\x1b[0m\n');

  } catch (err) {
    console.error('\n\x1b[31mError assembling project:\x1b[0m', err);
  } finally {
    rl.close();
  }
}

main();
