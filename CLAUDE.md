# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Music Player - Web application for uploading and playing local music files.

**Architecture**: 3-layer Headless Pattern (framework-independent core)
**Deployment**: Cloudflare Pages (auto-deploy on push to `main`)
**URL**: https://music-player.nagotzi.com/
**Docs**: See `docs/` for detailed guides

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (Wrangler + Vite with D1 local)
npm run type-check       # TypeScript compilation check
npm run lint             # Run ESLint + Prettier checks
npm run fmt              # Auto-fix formatting
npm test                 # Run tests with Vitest
npm run storybook        # Launch Storybook

# Database
npm run generate         # Generate migrations from schema
npm run migrate          # Apply migrations to local D1
npm run production-migrate  # Apply to production D1

# Build
npm run build            # Production build
```

## Architecture Overview

**Read `docs/ARCHITECTURE.md` for complete details.** Core concept:

```
Presentation Layer (views/, components/) ← Pure UI
         ↓ Props & Callbacks
Bridge Layer (react/) ← Observable → React State
         ↓ Observable / Promise
Core Layer (services/, utils/) ← Framework-independent
```

**Layer-specific guides are in `.claude/skills/`** - automatically loaded when working in those directories.

## Path Aliases (Required)

**Always use path aliases.** Imports from `src/` trigger ESLint errors.

```typescript
// Good
import { Track } from "@services/types";
import { useMusicPlayer } from "@react/player";

// Bad (ESLint error)
import { Track } from "src/services/types";
```

Aliases defined in `tsconfig.json`:
- `@services/*` → `src/services/*`
- `@react/*` → `src/react/*`
- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@theme/*` → `src/theme/*`
- `@assets/*` → `src/assets/*`

## Type Imports

Always separate type-only imports:

```typescript
import { BehaviorSubject, type Observable } from "rxjs";
import type { Track } from "@services/types";
```

## File Organization

```
src/
├── services/       # Core Layer (React-independent)
├── react/          # Bridge Layer (Hooks)
├── components/     # Presentation Layer (UI)
├── views/          # Presentation Layer (pages)
├── utils/          # Pure functions
├── theme/          # Global styles
└── assets/         # Static files
```

Component structure:
```
components/name/
├── index.tsx
├── styles.css.ts           # vanilla-extract
├── name.test.tsx           # Tests
└── name.stories.tsx        # Storybook
```

## Naming Conventions

- Components: `PascalCase`
- Factory functions: `createXxx`
- Hooks: `useXxx`
- RxJS Subjects: `xxxSubject`
- Observable getters: `getXxx`
- Files: `kebab-case.ts` or `index.tsx`

## Reference Documentation

- **`docs/ARCHITECTURE.md`** - Complete design philosophy
- **`docs/ONBOARDING.md`** - Detailed onboarding guide
- **`.claude/skills/`** - Context-specific guides:
  - `core-layer.md` - services/ development
  - `bridge-layer.md` - react/ development
  - `presentation-layer.md` - components/ development
  - `database.md` - DB schema and migrations
  - `error-handling.md` - Result type patterns
