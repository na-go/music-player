# Architecture Design Philosophy

このドキュメントは、本プロジェクトで採用している設計思想をまとめたものです。
他のプロジェクトでも応用可能な原則として記述しています。

## 目次

- [核となる設計原則](#核となる設計原則)
- [アーキテクチャ層の分離](#アーキテクチャ層の分離)
- [各層の責務と実装ガイドライン](#各層の責務と実装ガイドライン)
- [型安全性とエラーハンドリング](#型安全性とエラーハンドリング)
- [状態管理の方針](#状態管理の方針)
- [他のプロジェクトへの適用](#他のプロジェクトへの適用)

---

## 核となる設計原則

### 1. **Headless Architecture（フレームワーク非依存のコア）**

ビジネスロジックを特定のUIフレームワーク（React/Vue/Svelte等）から完全に分離します。

**メリット:**
- UIフレームワークを変更してもコアロジックは再利用可能
- テストが容易（UIなしでロジックを検証可能）
- Web/モバイル/デスクトップアプリで同じコードを共有可能

### 2. **Pure Functions First（純粋関数優先）**

副作用を持たない純粋関数を最優先とし、副作用は特定の層（services層）に隔離します。

**メリット:**
- 予測可能で理解しやすいコード
- テストが簡単（入力→出力の関係が明確）
- 並行処理やメモ化が安全

### 3. **Explicit Error Handling（明示的なエラー処理）**

`null` や `undefined` を避け、Result型などで成功/失敗を型レベルで表現します。

**メリット:**
- エラーハンドリングの強制
- ランタイムエラーの削減
- コードレビューで漏れを発見しやすい

---

## アーキテクチャ層の分離

本プロジェクトは、以下の3層アーキテクチャを採用しています：

```
┌─────────────────────────────────────┐
│  Presentation Layer                 │  views/, components/
│  (UIコンポーネント)                  │  - 純粋な表示ロジックのみ
│                                     │  - プロパティを受け取り描画
└──────────────┬──────────────────────┘
               │
               │ Props & Callbacks
               ▼
┌─────────────────────────────────────┐
│  Bridge Layer                       │  react/, vue/, etc.
│  (フレームワークアダプタ層)          │  - Observable → State変換
│                                     │  - Hooksやコンポーザブルを提供
└──────────────┬──────────────────────┘
               │
               │ Observable / Promise
               ▼
┌─────────────────────────────────────┐
│  Core Layer (Headless)              │  services/, utils/
│  (ビジネスロジック)                  │  - フレームワーク非依存
│                                     │  - RxJS, Promise等で状態管理
└─────────────────────────────────────┘
```

---

## 各層の責務と実装ガイドライン

### Core Layer（services/, utils/）

**責務:**
- ビジネスロジックの実装
- データの永続化・取得
- ドメインモデルの定義

**ルール:**
```typescript
// ✅ Good: フレームワーク非依存、Observable/Promiseを返す
export const createMusicPlayer = (playlist: Playlist): MusicPlayer => {
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  return {
    getIsPlaying: isPlayingSubject.asObservable(),
    play: async () => { /* ... */ },
  };
};

// ❌ Bad: Reactに依存
export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false); // React依存!
};
```

**実装例（本プロジェクト）:**
- `src/services/player.ts` - RxJSで状態管理するプレイヤー
- `src/services/playlist.ts` - プレイリスト管理
- `src/utils/services/generate-track-from-blob.ts` - 純粋関数

---

### Bridge Layer（react/, vue/, etc.）

**責務:**
- Core LayerとUI Layerの橋渡し
- Observable/Promise → Framework State への変換
- Singleton管理（必要に応じて）

**ルール:**
```typescript
// ✅ Good: Hookで状態を変換し、UIに渡す
export const useMusicPlayer = (): MusicPlayerState => {
  const [isPlaying, setIsPlaying] = useState(false);
  const musicPlayer = useMemo(() => createMusicPlayer(playlist), []);

  useEffect(() => {
    // Observable購読 → React State更新
    const subscription = musicPlayer.getIsPlaying.subscribe(setIsPlaying);
    return () => subscription.unsubscribe();
  }, [musicPlayer]);

  return { isPlaying, play: musicPlayer.play };
};

// ❌ Bad: UIロジック（表示制御）を含む
export const useMusicPlayer = () => {
  // ...
  const buttonLabel = isPlaying ? "Stop" : "Play"; // これはUI層の責務!
  return { buttonLabel };
};
```

**実装例（本プロジェクト）:**
- `src/react/player.ts` - `useMusicPlayer` Hook
- Singleton パターンで player/playlist インスタンスを管理

---

### Presentation Layer（views/, components/）

**責務:**
- UIの描画のみ
- ユーザー操作のイベントをコールバックで通知

**ルール:**
```typescript
// ✅ Good: 純粋なコンポーネント
export const MusicPlayer: FC = () => {
  const { isPlaying, play, pause } = useMusicPlayer();

  return (
    <button onClick={isPlaying ? pause : play}>
      {isPlaying ? "Stop" : "Play"}
    </button>
  );
};

// ❌ Bad: ビジネスロジックを含む
export const MusicPlayer: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = new Audio(); // services層の責務!

  const play = () => {
    audio.play(); // ロジックをコンポーネントに書いてはいけない
    setIsPlaying(true);
  };

  return <button onClick={play}>Play</button>;
};
```

**実装例（本プロジェクト）:**
- `src/components/music-player/index.tsx` - 200行以上だがロジックゼロ
- `src/views/index.tsx` - レイアウトのみ

---

## 型安全性とエラーハンドリング

### Result型によるエラーハンドリング

`null` や `undefined` による暗黙的なエラーを避け、`Result<T, E>` 型で明示的に表現します。

```typescript
// ✅ Good: Result型で成功/失敗を明示
import { ok, err, type Result } from "neverthrow";

export const getElementById = (id: string): Result<HTMLElement, string> => {
  const element = document.getElementById(id);
  return element !== null ? ok(element) : err("Element not found");
};

// 使用側でエラーハンドリングが強制される
getElementById("app").match(
  (element) => render(element),
  (error) => alert(error)
);

// ❌ Bad: nullチェック漏れのリスク
export const getElementById = (id: string): HTMLElement | null => {
  return document.getElementById(id); // nullチェック忘れの可能性
};
```

**実装例（本プロジェクト）:**
- `src/utils/dom/get-element-by-id/index.tsx`
- `src/index.tsx:7-10` - match関数で強制的にエラーハンドリング

---

## 状態管理の方針

### RxJSによるリアクティブな状態管理

`BehaviorSubject` と `Observable` を使い、宣言的に状態を管理します。

```typescript
// Core Layer: Observableで状態を公開
export const createMusicPlayer = (): MusicPlayer => {
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  return {
    // 読み取り専用のObservableとして公開
    getIsPlaying: isPlayingSubject.asObservable(),

    // 状態更新メソッド
    play: async () => {
      await audio.play();
      isPlayingSubject.next(true); // 状態更新
    },
  };
};

// Bridge Layer: ObservableをReact Stateに変換
export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const sub = musicPlayer.getIsPlaying.subscribe(setIsPlaying);
    return () => sub.unsubscribe();
  }, []);

  return { isPlaying };
};
```

**メリット:**
- 複数のコンポーネントで同じ状態を共有しやすい
- 時間軸のある処理（debounce, throttle等）を宣言的に記述可能
- テスト時にObservableをモック化しやすい

---

## 他のプロジェクトへの適用

### ディレクトリ構成テンプレート

```
src/
├── services/          # Core Layer（フレームワーク非依存）
│   ├── player.ts      # ビジネスロジック
│   ├── playlist.ts
│   └── types.ts       # ドメインモデル
├── react/             # Bridge Layer（React専用）
│   └── player.ts      # Hooks
├── vue/               # Bridge Layer（Vue専用、必要に応じて）
│   └── player.ts      # Composables
├── components/        # Presentation Layer
│   └── MusicPlayer.tsx
├── views/             # Presentation Layer（ページレベル）
│   └── index.tsx
└── utils/             # 純粋関数ユーティリティ
    ├── dom/
    └── services/
```

### チェックリスト

新機能を追加する際、以下を確認してください：

- [ ] **Core Layer**: ビジネスロジックはservices/に配置し、React/Vue等に依存していないか？
- [ ] **Bridge Layer**: UIフレームワーク固有の変換はreact/等に隔離されているか？
- [ ] **Presentation Layer**: コンポーネントは純粋関数か？（props受取 → UI描画のみ）
- [ ] **Error Handling**: `null`/`undefined` ではなくResult型を使っているか？
- [ ] **Pure Functions**: 副作用はCore Layerに隔離されているか？
- [ ] **Testability**: UIなしでロジックをテストできるか？

### 他フレームワークへの移植例

Reactから別フレームワークへ移行する場合：

```typescript
// services/player.ts は変更不要（フレームワーク非依存）

// vue/player.ts （新規作成）
import { ref, onMounted, onUnmounted } from 'vue';
import { createMusicPlayer } from '@services/player';

export const useMusicPlayer = () => {
  const isPlaying = ref(false);
  const musicPlayer = createMusicPlayer(playlist);

  onMounted(() => {
    const sub = musicPlayer.getIsPlaying.subscribe((val) => {
      isPlaying.value = val;
    });
    onUnmounted(() => sub.unsubscribe());
  });

  return { isPlaying, play: musicPlayer.play };
};
```

---

## まとめ

この設計思想の核心は、**「関心の分離」と「純粋性の強制」**です。

1. **Headless Core** により、UIフレームワークに依存しないビジネスロジックを構築
2. **Bridge Layer** でフレームワーク固有の変換を隔離
3. **Pure Presentation** でテスト・保守しやすいUIを実現
4. **Explicit Error Handling** でランタイムエラーを削減
5. **Reactive State Management** で宣言的な状態管理

この原則に従うことで、長期的に保守可能で、他プロジェクトにも応用可能なコードベースを構築できます。
