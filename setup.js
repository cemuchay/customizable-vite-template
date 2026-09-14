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

  const eslintResponse = (await askQuestion('🧹 Include ESLint v9 + Prettier code formatting? (y/n, default: y): ')).trim().toLowerCase();
  const includeEslint = eslintResponse !== 'n';

  const gitResponse = (await askQuestion('🌱 Initialize Git repository automatically? (y/n, default: y): ')).trim().toLowerCase();
  const initGit = gitResponse !== 'n';

  const pmChoice = (await askQuestion('📦 Select package manager (npm/pnpm/yarn/bun, default: npm): ')).trim().toLowerCase() || 'npm';
  const pkgManager = ['npm', 'pnpm', 'yarn', 'bun'].includes(pmChoice) ? pmChoice : 'npm';

  const destinationResponse = (await askQuestion('📍 Configure in-place inside current directory? (y/n, default: y): ')).trim().toLowerCase();
  const inPlace = destinationResponse !== 'n';

  const targetDir = inPlace ? process.cwd() : path.join(process.cwd(), projectName);

  console.log('\n\x1b[36mConfiguring Stack Summary:\x1b[0m');
  console.log(`- Project Path:      ${targetDir}`);
  console.log(`- Tailwind CSS:      v${tailwindChoice}`);
  console.log(`- React Router v7:   ${includeRouter ? 'Yes' : 'No'}`);
  console.log(`- Testing (Vitest):  ${includeTesting ? 'Yes' : 'No'}`);
  console.log(`- Express Backend:   ${includeServer ? 'Yes' : 'No'}`);
  console.log(`- ESLint + Prettier: ${includeEslint ? 'Yes' : 'No'}`);
  console.log(`- Git Repository:    ${initGit ? 'Yes' : 'No'}`);
  console.log(`- Package Manager:   ${pkgManager}`);
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
    copyTemplate('base/.gitignore', '.gitignore');
    copyTemplate('base/.env.example', '.env.example');
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

    // 7b. Handle ESLint + Prettier Setup
    if (includeEslint) {
      console.log('- Injecting ESLint v9 flat config and Prettier rules...');
      copyTemplate('eslint/eslint.config.js', 'eslint.config.js');
      copyTemplate('eslint/.prettierrc', '.prettierrc');
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

    // Inject ESLint & Prettier dependencies
    if (includeEslint) {
      packageJson.scripts["lint"] = "eslint .";
      packageJson.scripts["format"] = "prettier --write .";
      packageJson.devDependencies["eslint"] = "^9.19.0";
      packageJson.devDependencies["@eslint/js"] = "^9.19.0";
      packageJson.devDependencies["eslint-plugin-react-hooks"] = "^5.1.0";
      packageJson.devDependencies["eslint-plugin-react-refresh"] = "^0.4.18";
      packageJson.devDependencies["globals"] = "^15.14.0";
      packageJson.devDependencies["typescript-eslint"] = "^8.21.0";
      packageJson.devDependencies["prettier"] = "^3.4.2";
    }

    // Inject server dependencies
    if (includeServer) {
      packageJson.scripts["server"] = "tsx watch server/index.ts";
      const devCmd = pkgManager === 'npm' ? 'npm run' : pkgManager;
      packageJson.scripts["dev"] = `concurrently "${devCmd} dev:client" "${devCmd} server"`;
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
    console.log('- Generating customized project README documentation...');
    let projectReadme = `# ${projectName}\n\n`;
    projectReadme += `This project was generated using \`@chizalam/create-vite-app\`.\n\n`;
    projectReadme += `## 🛠 Tech Stack\n\n`;
    projectReadme += `- **Framework**: React 19 + Vite 6 + TypeScript\n`;
    projectReadme += `- **Styling**: Tailwind CSS v${tailwindChoice}\n`;
    if (includeRouter) projectReadme += `- **Routing**: React Router v7\n`;
    if (includeTesting) projectReadme += `- **Testing**: Vitest + React Testing Library + JSDOM\n`;
    if (includeServer) projectReadme += `- **Backend**: Express + TypeScript (\`tsx\` live reload)\n`;
    if (includeEslint) projectReadme += `- **Linting & Formatting**: ESLint 9 + Prettier\n`;
    projectReadme += `- **State & Async Data**: Zustand + TanStack Query v5\n\n`;
    projectReadme += `## 🚀 Quick Start\n\n`;
    projectReadme += `### 1. Install Dependencies\n\`\`\`bash\n${pkgManager} install\n\`\`\`\n\n`;
    projectReadme += `### 2. Start Development Server\n\`\`\`bash\n${pkgManager === 'npm' ? 'npm run dev' : `${pkgManager} dev`}\n\`\`\`\n`;
    if (includeServer) {
      projectReadme += `This runs the frontend (Vite) and the backend (Express) concurrently.\n`;
    }
    projectReadme += `\n`;
    if (includeTesting) {
      projectReadme += `### 3. Run Automated Tests\n\`\`\`bash\n${pkgManager === 'npm' ? 'npm run test' : `${pkgManager} test`}\n\`\`\`\n\n`;
    }
    if (includeEslint) {
      projectReadme += `### 4. Lint & Format Code\n\`\`\`bash\n${pkgManager === 'npm' ? 'npm run lint' : `${pkgManager} lint`}\n${pkgManager === 'npm' ? 'npm run format' : `${pkgManager} format`}\n\`\`\`\n\n`;
    }
    projectReadme += `### Build for Production\n\`\`\`bash\n${pkgManager === 'npm' ? 'npm run build' : `${pkgManager} build`}\n\`\`\`\n\n`;

    fs.writeFileSync(
      path.join(targetDir, 'README.md'),
      projectReadme
    );

    // 11. Optional Git Initialization
    if (initGit) {
      try {
        console.log('- Initializing Git repository...');
        execSync('git init', { cwd: targetDir, stdio: 'ignore' });
        execSync('git add .', { cwd: targetDir, stdio: 'ignore' });
        execSync('git commit -m "Initial commit from create-vite-app"', { cwd: targetDir, stdio: 'ignore' });
        console.log('\x1b[32m✔ Git repository initialized with initial commit!\x1b[0m');
      } catch (e) {
        console.warn('Warning: Failed to initialize Git repository.', e.message);
      }
    }

    // 12. Cleanup setup templates (only if inPlace, to clean workspace)
    let cleanup = 'y';
    if (inPlace) {
      cleanup = (await askQuestion('🧹 Clean up setup generator files & templates? (y/n, default: y): ')).trim().toLowerCase();
    } else {
      cleanup = 'n';
    }

    if (cleanup !== 'n') {
      console.log('- Cleaning setup artifacts and template source files...');
      try {
        fs.rmSync(path.join(targetDir, 'templates'), { recursive: true, force: true });
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

    const installResponse = (await askQuestion(`📦 Install dependencies now using ${pkgManager}? (y/n, default: y): `)).trim().toLowerCase();
    if (installResponse !== 'n') {
      console.log(`\n📦 Running "${pkgManager} install"... (This may take a minute)`);
      execSync(`${pkgManager} install`, { cwd: targetDir, stdio: 'inherit' });
      console.log('\n\x1b[32m✔ Dependencies installed successfully!\x1b[0m');
    }

    console.log('\n🎉 Setup complete. Run the following to start:');
    if (!inPlace) {
      console.log(`\x1b[36mcd ${projectName}\x1b[0m`);
    }
    const runDevCmd = pkgManager === 'npm' ? 'npm run dev' : `${pkgManager} dev`;
    console.log(`\x1b[36m${runDevCmd}\x1b[0m\n`);

  } catch (err) {
    console.error('\n\x1b[31mError assembling project:\x1b[0m', err);
  } finally {
    rl.close();
  }
}

main();
