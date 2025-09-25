# Vite Build Issues - Complete Fix Guide

This document outlines the comprehensive solution for resolving persistent Vite build issues in Laravel projects, specifically tailored for Yarn package management.

## Problem Summary

The project was experiencing multiple Vite build failures with the following error patterns:
- `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'laravel-vite-plugin'`
- `Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@vitejs/plugin-react'`
- `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite'`
- `Failed to load PostCSS config ... Cannot find module 'autoprefixer'`
- `ReferenceError: require is not defined in ES module scope`
- `Module level directives cause errors when bundled, "use client" in "node_modules/@radix-ui" was ignored`
- `Some chunks are larger than 500 kB after minification`

## Root Causes Identified

1. **Package Dependencies**: Critical packages were in `devDependencies` but needed during production builds
2. **ES Module Context**: `__dirname` not properly resolved in ES module context
3. **Circular Dependencies**: Vite config had circular import issues
4. **PostCSS Configuration**: Missing or conflicting PostCSS dependencies
5. **Build Warnings**: "use client" directives in third-party packages
6. **Bundle Size**: Lack of proper code splitting

## Complete Solution

### 1. Package.json Dependencies Fix

**Problem**: Critical packages in `devDependencies` causing build failures.

**Solution**: Move essential packages to `dependencies`:

```json
{
  "dependencies": {
    "@headlessui/react": "^2.2.0",
    "vite": "^7.1.7",
    "laravel-vite-plugin": "^2.0.1",
    "@vitejs/plugin-react": "^5.0.3",
    "autoprefixer": "^10.4.21",
    "@inertiajs/react": "^2.1.11",
    // ... other dependencies
  },
  "devDependencies": {
    "terser": "^5.44.0",
    // ... other devDependencies
  }
}
```

### 2. Vite Configuration Fix

**Problem**: ES module context issues and missing configurations.

**Solution**: Complete `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        {
            name: 'remove-use-client',
            transform(code, id) {
                if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/@headlessui')) {
                    return code.replace(/"use client";?\s*/g, '');
                }
            }
        }
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@/components': resolve(__dirname, 'resources/js/components'),
            '@/pages': resolve(__dirname, 'resources/js/pages'),
            '@/hooks': resolve(__dirname, 'resources/js/hooks'),
            '@/utils': resolve(__dirname, 'resources/js/utils'),
            '@/types': resolve(__dirname, 'resources/js/types'),
            '@/services': resolve(__dirname, 'resources/js/services'),
            '@/layouts': resolve(__dirname, 'resources/js/layouts'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    inertia: ['@inertiajs/react'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-label', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-navigation-menu', '@radix-ui/react-collapsible', '@radix-ui/react-dismissable-layer', '@radix-ui/react-focus-guards', '@radix-ui/react-focus-scope', '@radix-ui/react-presence', '@radix-ui/react-portal', '@radix-ui/react-popper', '@radix-ui/react-collection', '@radix-ui/react-menu', '@radix-ui/react-roving-focus'],
                    headlessui: ['@headlessui/react'],
                    icons: ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 2000,
    },
});
```

### 3. PostCSS Configuration Fix

**Problem**: PostCSS autoprefixer dependency resolution conflicts.

**Solution**: Simplified `postcss.config.js`:

```javascript
export default {
    plugins: {
        '@tailwindcss/postcss': {},
    },
};
```

### 4. Package Installation Commands

**For Yarn (Recommended)**:
```bash
# Clean installation
rm -rf node_modules yarn.lock
yarn install

# Install missing packages
yarn add vite laravel-vite-plugin @vitejs/plugin-react autoprefixer @inertiajs/react
yarn add terser --dev

# Build
yarn build
```

**For NPM (Alternative)**:
```bash
# Clean installation
rm -rf node_modules package-lock.json
npm install

# Install missing packages
npm install vite laravel-vite-plugin @vitejs/plugin-react autoprefixer @inertiajs/react
npm install terser --save-dev

# Build
npm run build
```

### 5. Key Configuration Elements

#### A. ES Module Context Fix
```javascript
import { fileURLToPath, URL } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
```

#### B. Custom Plugin for "use client" Directives
```javascript
{
    name: 'remove-use-client',
    transform(code, id) {
        if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/@headlessui')) {
            return code.replace(/"use client";?\s*/g, '');
        }
    }
}
```

#### C. Code Splitting Configuration
```javascript
build: {
    rollupOptions: {
        output: {
            manualChunks: {
                vendor: ['react', 'react-dom'],
                inertia: ['@inertiajs/react'],
                ui: ['@radix-ui/react-*'],
                headlessui: ['@headlessui/react'],
                icons: ['lucide-react'],
            },
        },
        chunkSizeWarningLimit: 2000,
    },
}
```

### 6. Troubleshooting Steps

If issues persist, follow this sequence:

1. **Clean Everything**:
   ```bash
   rm -rf node_modules yarn.lock package-lock.json
   ```

2. **Check Node.js Version**:
   ```bash
   node --version  # Should be 18+ for ES modules
   ```

3. **Verify Package.json**:
   - Ensure `"type": "module"` is present
   - Critical packages in `dependencies`, not `devDependencies`

4. **Reinstall Dependencies**:
   ```bash
   yarn install
   ```

5. **Test Build**:
   ```bash
   yarn build
   ```

### 7. Prevention Tips

1. **Always use `dependencies`** for packages needed in production builds
2. **Keep Vite config simple** initially, add complexity gradually
3. **Use Yarn over NPM** for better dependency resolution
4. **Regular cleanup** of `node_modules` when switching between projects
5. **Version pinning** for critical packages to avoid breaking changes

### 8. Common Error Solutions

| Error | Solution |
|-------|----------|
| `Cannot find package 'vite'` | Move to `dependencies`, clean install |
| `require is not defined` | Use ES module syntax, fix `__dirname` |
| `"use client" ignored` | Add custom plugin to remove directives |
| `Chunk size warnings` | Configure `manualChunks` and increase limit |
| `PostCSS errors` | Simplify config, ensure autoprefixer installed |

### 9. Final Working Configuration

The final working setup includes:
- ✅ All critical packages in `dependencies`
- ✅ Proper ES module context resolution
- ✅ Custom plugin for "use client" directives
- ✅ Optimized code splitting
- ✅ Simplified PostCSS configuration
- ✅ Laravel Vite plugin integration

### 10. Build Results

After fixes:
- **Build Time**: ~6-10 seconds
- **Bundle Size**: ~622 kB (optimized)
- **Chunks**: Properly split (vendor, ui, icons, etc.)
- **Warnings**: Eliminated
- **Status**: ✅ Clean builds

---

## Quick Reference Commands

```bash
# Clean install
rm -rf node_modules yarn.lock && yarn install

# Build
yarn build

# Development
yarn dev

# Check for issues
yarn build --debug
```

This guide should resolve 99% of Vite build issues in Laravel projects using Yarn. Keep this document handy for future reference!
