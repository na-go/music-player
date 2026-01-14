---
name: bridge-layer
description: >
  Guide for developing Bridge Layer (react/) - Hooks that convert Observables to React state.
  Use when working with files in src/react/ or when creating React Hooks that subscribe to Observables.
---

# Bridge Layer Development

## Rules

Bridge Layer converts Core Layer Observables to React state via Hooks.

## Pattern: Observable → React State

```typescript
// src/react/player.ts
import { useEffect, useMemo, useState } from "react";
import { distinctUntilChanged } from "rxjs";
import { createMusicPlayer } from "@services/player";

export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const musicPlayer = useMemo(() => createSingletonPlayer(), []);

  useEffect(() => {
    const subscription = musicPlayer.getIsPlaying
      .pipe(distinctUntilChanged())  // Prevent unnecessary updates
      .subscribe(setIsPlaying);

    return () => subscription.unsubscribe();  // REQUIRED!
  }, [musicPlayer]);

  return {
    isPlaying,
    play: musicPlayer.play,
    pause: musicPlayer.pause,
  };
};
```

## Singleton Pattern

For services that should have single instance (like player):

```typescript
let player: MusicPlayer | null = null;

const createSingletonPlayer = (playlist: Playlist): MusicPlayer => {
  if (!player) {
    player = createMusicPlayer(playlist);
  }
  return player;
};
```

## Critical: Always Unsubscribe

**Memory leak prevention:** Always unsubscribe in useEffect cleanup.

```typescript
useEffect(() => {
  const subscription = observable.subscribe(setState);
  return () => subscription.unsubscribe();  // This is mandatory
}, []);
```

## Use distinctUntilChanged()

Prevent unnecessary React re-renders:

```typescript
musicPlayer.getIsPlaying
  .pipe(distinctUntilChanged())  // Only emit when value changes
  .subscribe(setIsPlaying);
```

## Naming Conventions

- Hooks: `useXxx` (e.g., `useMusicPlayer`)
- Return object with state + methods from Core Layer

## What NOT to do

```typescript
// ❌ Bad: UI logic in Bridge Layer
export const useMusicPlayer = () => {
  const buttonLabel = isPlaying ? "Stop" : "Play";  // This is Presentation Layer!
  return { buttonLabel };
};

// ✅ Good: Only state + methods
export const useMusicPlayer = () => {
  return { isPlaying, play, pause };
};
```

## Checklist

- [ ] Hook name starts with `use`
- [ ] Observable subscribed in `useEffect`
- [ ] `unsubscribe()` in cleanup function
- [ ] Use `distinctUntilChanged()` for optimization
- [ ] No UI logic (conditional rendering, labels, etc.)
- [ ] Singleton pattern if service should be shared
