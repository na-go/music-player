---
name: presentation-layer
description: >
  Guide for developing Presentation Layer (components/, views/) - pure UI components.
  Use when working with files in src/components/ or src/views/, or when creating React components.
---

# Presentation Layer Development

## Rules

**Pure UI components only.** No business logic. All data comes from Bridge Layer Hooks.

## Pattern: Pure Component

```typescript
// src/components/music-player/index.tsx
import type { FC } from "react";
import { useMusicPlayer } from "@react/player";
import * as styles from "./styles.css";

export const MusicPlayer: FC = () => {
  const {
    isPlaying,
    play,
    pause,
    currentTime,
    // ... all state/methods from Hook
  } = useMusicPlayer();

  return (
    <div className={styles.container}>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <span>{currentTime}s</span>
    </div>
  );
};
```

## File Structure

```
components/component-name/
├── index.tsx                    # Component
├── styles.css.ts                # vanilla-extract styles
├── component-name.test.tsx      # Tests
└── component-name.stories.tsx   # Storybook
```

## Styling with vanilla-extract

```typescript
// components/music-player/styles.css.ts
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  padding: "16px",
  backgroundColor: "#F8F8F8",
});

export const button = style({
  cursor: "pointer",
  border: "none",
});

// Import in component
import * as styles from "./styles.css";
<div className={styles.container}>
  <button className={styles.button}>
```

## Naming Conventions

- Components: `PascalCase` (e.g., `MusicPlayer`)
- Component file: `index.tsx`
- Styles file: `styles.css.ts`
- Test file: `component-name.test.tsx`
- Storybook file: `component-name.stories.tsx`

## What NOT to do

```typescript
// ❌ Bad: Business logic in component
export const MusicPlayer: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = new Audio();  // This belongs in Core Layer!

  const play = () => {
    audio.play();
    setIsPlaying(true);
  };
};

// ❌ Bad: Direct Observable subscription
export const MusicPlayer: FC = () => {
  useEffect(() => {
    musicPlayer.getIsPlaying.subscribe(setIsPlaying);  // Use Bridge Layer Hook!
  }, []);
};
```

## Allowed in Presentation Layer

- Conditional rendering (`{isPlaying ? "A" : "B"}`)
- Event handlers that call Hook methods (`onClick={play}`)
- Local UI state (e.g., modal open/close, form validation)
- Memoization with `useCallback`, `useMemo`

## Sub-components

Define in same file, pass data via props:

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

export const MusicPlayer: FC = () => {
  const { play } = useMusicPlayer();
  return <Button label="Play" onClick={play} />;
};
```

## Checklist

- [ ] All data from Bridge Layer Hooks
- [ ] No business logic (Audio, RxJS, etc.)
- [ ] No direct Observable subscriptions
- [ ] Styles in `styles.css.ts` using vanilla-extract
- [ ] Event handlers use `useCallback` if passed to child components
