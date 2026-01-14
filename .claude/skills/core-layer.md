---
description: Guide for developing Core Layer (services/) - framework-independent business logic
patterns:
  - "src/services/**"
  - "**/*services*/**"
---

# Core Layer Development

## Rules

**Core Layer is framework-independent.** Never import React, Vue, or any UI framework.

## Pattern: Factory Function + RxJS Observable

```typescript
// src/services/player.ts
import { BehaviorSubject, type Observable } from "rxjs";

export interface MusicPlayer {
  getIsPlaying: Observable<boolean>;  // Read-only Observable
  play: () => Promise<void>;
  pause: () => Promise<void>;
}

export const createMusicPlayer = (playlist: Playlist): MusicPlayer => {
  const audio = new Audio();
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  return {
    // Expose as Observable (hide Subject)
    getIsPlaying: isPlayingSubject,

    play: async () => {
      await audio.play();
      isPlayingSubject.next(true);  // Update state
    },

    pause: async () => {
      audio.pause();
      isPlayingSubject.next(false);
    },
  };
};
```

## State Management with RxJS

1. **Use BehaviorSubject** for state that needs initial value
2. **Expose as Observable** (read-only) - don't expose Subject directly
3. **Update with `.next()`** - only within the service
4. **Use `firstValueFrom()`** to get current value when needed

```typescript
// Get current value
const tracks = await firstValueFrom(playlist.getTracks);
```

## Naming Conventions

- Factory functions: `createXxx` (e.g., `createMusicPlayer`)
- Subjects: `xxxSubject` (e.g., `isPlayingSubject`)
- Observable getters: `getXxx` (e.g., `getIsPlaying`)
- All methods: `async` functions returning `Promise<void>`

## Dependency Injection

Pass dependencies through factory function parameters:

```typescript
export const createMusicPlayer = (playlist: Playlist): MusicPlayer => {
  // playlist is injected, not created internally
};
```

## Checklist

- [ ] No React/Vue/Svelte imports
- [ ] Factory function with `create` prefix
- [ ] BehaviorSubject → Observable pattern
- [ ] All methods return `Promise<void>`
- [ ] Dependencies injected via parameters
