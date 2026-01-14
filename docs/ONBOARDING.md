# Music Player プロジェクト オンボーディング資料

このドキュメントは、Music Playerプロジェクトに新しく参加する開発者向けの実践的なガイドです。
設計思想については [`ARCHITECTURE.md`](./ARCHITECTURE.md) を参照してください。

## 目次

- [プロジェクト概要](#プロジェクト概要)
- [環境構築](#環境構築)
- [ディレクトリ構造](#ディレクトリ構造)
- [技術スタック](#技術スタック)
- [コーディング規約](#コーディング規約)
- [開発ワークフロー](#開発ワークフロー)
- [実装パターンと実例](#実装パターンと実例)
- [よくあるタスク](#よくあるタスク)
- [デプロイ](#デプロイ)
- [トラブルシューティング](#トラブルシューティング)

---

## プロジェクト概要

### 基本情報

- **プロジェクト名**: Music Player
- **目的**: ローカルから楽曲ファイルを読み込み、再生することができるWebアプリケーション
- **デプロイURL**: https://music-player.nagotzi.com/
- **プラットフォーム**: Cloudflare Pages
- **Node.js**: 18.16.0 (Volta管理)
- **npm**: 9.6.5

### 主要機能

- 音楽ファイルのアップロードと再生
- プレイリスト管理
- 再生コントロール（再生/一時停止、次へ/前へ、シーク、音量調整）
- リピート機能
- Cloudflare D1を使用した楽曲情報の永続化

---

## 環境構築

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd music-player
```

### 2. Node.jsのバージョン確認

Voltaを使用している場合、自動的に正しいバージョンに切り替わります。

```bash
node -v  # 18.16.0であることを確認
npm -v   # 9.6.5であることを確認
```

### 3. 依存関係のインストール

```bash
npm install
```

これにより、`patch-package`が自動実行されます（postinstallスクリプト）。

### 4. 開発サーバーの起動

```bash
npm run dev
```

Wrangler経由でViteが起動し、Cloudflare Pages環境をローカルでエミュレートします。
D1データベースも`--persist`オプションでローカルに永続化されます。

### 5. ブラウザでアクセス

```
http://localhost:5173
```

---

## ディレクトリ構造

```
music-player/
├── .claude/                 # Claude Code設定
│   └── skills/              # コンテキスト別ガイド
├── .wrangler/               # Cloudflare Wrangler作業ディレクトリ
├── db/
│   └── schema/              # Drizzle ORMスキーマ定義
│       └── tracks.ts        # tracksテーブルのスキーマ
├── docs/                    # プロジェクトドキュメント
│   ├── ARCHITECTURE.md      # 設計思想
│   └── ONBOARDING.md        # オンボーディング資料
├── migrations/              # D1マイグレーションファイル
├── src/
│   ├── assets/              # 静的ファイル（SVGアイコンなど）
│   │   └── icons/
│   ├── components/          # 再利用可能なUIコンポーネント
│   │   ├── music-player/    # 音楽プレイヤーコンポーネント
│   │   │   ├── index.tsx
│   │   │   └── styles.css.ts
│   │   └── toggle-theme/    # テーマ切り替えコンポーネント
│   │       ├── index.tsx
│   │       ├── styles.css.ts
│   │       ├── toggle-theme.test.tsx
│   │       └── toggle-theme.stories.tsx
│   ├── react/               # Bridge Layer（Reactアダプタ）
│   │   └── player.ts        # useMusicPlayer Hook
│   ├── services/            # Core Layer（ビジネスロジック）
│   │   ├── player.ts        # 音楽プレイヤーのロジック
│   │   ├── playlist.ts      # プレイリストのロジック
│   │   └── types.ts         # 型定義
│   ├── theme/               # テーマとグローバルスタイル
│   │   ├── global.css.ts
│   │   ├── provider.tsx
│   │   └── styles.css.ts
│   ├── utils/               # ユーティリティ関数
│   │   ├── dom/             # DOM操作関連
│   │   │   └── get-element-by-id/
│   │   │       ├── index.tsx
│   │   │       └── get-element-by-id.test.ts
│   │   ├── services/        # サービス層のヘルパー
│   │   │   ├── generate-id.ts
│   │   │   └── generate-track-from-blob.ts
│   │   └── view/            # UI表示用のヘルパー
│   │       └── translate-number-to-date.ts
│   ├── views/               # ページレベルのUIコンポーネント
│   │   ├── index.tsx
│   │   └── styles.css.ts
│   └── index.tsx            # エントリーポイント
├── .eslintrc.cjs            # ESLint設定
├── tsconfig.json            # TypeScript設定
├── vite.config.ts           # Vite設定
├── vitest-setup.ts          # Vitestセットアップ
├── package.json
├── CLAUDE.md                # Claude Code向けガイド
└── README.md
```

### ファイル配置ルール

1. **コンポーネントは専用ディレクトリにまとめる**
   - `src/components/component-name/index.tsx`
   - `src/components/component-name/styles.css.ts`
   - テスト: `src/components/component-name/component-name.test.tsx`
   - Storybook: `src/components/component-name/component-name.stories.tsx`

2. **パスエイリアスを使用する**（`tsconfig.json`で定義）
   ```typescript
   import { Track } from "@services/types";           // ✅
   import { Track } from "../../services/types";      // ❌
   import { Track } from "src/services/types";        // ❌（ESLintエラー）
   ```

3. **ファイル名の規則**
   - コンポーネント: `index.tsx`（ディレクトリ名で識別）
   - スタイル: `styles.css.ts`
   - ユーティリティ: `kebab-case.ts`
   - 型定義: `types.ts`

---

## 技術スタック

### コア技術

| 技術 | バージョン | 用途 |
|-----|----------|-----|
| **React** | 18.2.0 | UIライブラリ |
| **TypeScript** | 5.0.4 | 型安全性 |
| **Vite** | 4.3.4 | ビルドツール・開発サーバー |
| **RxJS** | 7.8.1 | リアクティブ状態管理 |
| **vanilla-extract** | 1.11.0 | 型安全なCSS-in-JS |
| **Hono** | 3.2.5 | API（Cloudflare Workers） |
| **Drizzle ORM** | 0.26.5 | D1データベース操作 |
| **neverthrow** | 6.0.0 | Result型によるエラーハンドリング |

### 開発ツール

| ツール | 用途 |
|-------|-----|
| **Vitest** | ユニットテスト |
| **jsdom** | DOM環境のエミュレート |
| **@testing-library/react** | Reactコンポーネントテスト |
| **Storybook** | コンポーネント開発環境 |
| **ESLint** | コード品質チェック |
| **Prettier** | コードフォーマット |
| **Wrangler** | Cloudflare開発ツール |

### アーキテクチャパターン

本プロジェクトは **Headless Architecture（3層アーキテクチャ）** を採用しています。
詳細は [`ARCHITECTURE.md`](./ARCHITECTURE.md) を参照してください。

```
Presentation Layer (views/, components/) ← React
         ↕ Props & Callbacks
Bridge Layer (react/)                    ← React Hooks
         ↕ Observable / Promise
Core Layer (services/, utils/)           ← Framework非依存
```

---

## コーディング規約

### 命名規則

#### ファイル名
- コンポーネント: `index.tsx`（ディレクトリ名で識別）
- スタイル: `styles.css.ts`
- ユーティリティ: `kebab-case.ts`（例: `generate-id.ts`）
- 型定義: `types.ts`

#### 関数名
- コンポーネント: `PascalCase`（例: `MusicPlayer`）
- Factory関数: `createXxx`（例: `createMusicPlayer`）
- Hooks: `useXxx`（例: `useMusicPlayer`）
- ユーティリティ: `camelCase`（例: `translateNumberToDate`）

#### 変数名
- RxJS Subject: `xxxSubject`（例: `isPlayingSubject`）
- Observable公開: プロパティ名（例: `getIsPlaying`）
- 定数: `camelCase`

### インポートスタイル

```typescript
// 1. 外部ライブラリ
import { BehaviorSubject, type Observable, map } from "rxjs";

// 2. 内部モジュール（パスエイリアス使用）
import { createTrackFromBlob } from "@utils/services/generate-track-from-blob";

// 3. 型のみのインポートは分離
import type { Track } from "@services/types";
```

**重要なルール**:
- `type` importは明示的に `import type` で記述する
- パスエイリアス（`@utils/*`など）を必ず使用する
- `src/` から始まる相対パスは禁止（ESLintエラー）

### 型定義

```typescript
// ✅ interfaceでオブジェクトの形を定義
export interface MusicPlayer {
  getAudio: Observable<HTMLAudioElement | null>;
  play: () => Promise<void>;
}

// ✅ typeで複雑な型やユニオン型を定義
export type Track = {
  id: string;
  title: string;
  duration: number;
  url: string;
};
```

### ESLint重要ルール

```javascript
// .eslintrc.cjs
{
  "no-restricted-imports": ["error", { "patterns": ["src/"] }],  // src/からのインポート禁止
  "react/react-in-jsx-scope": "off",                             // React自動インポート
}
```

### スタイリング（vanilla-extract）

```typescript
// components/music-player/styles.css.ts
import { style } from "@vanilla-extract/css";

export const playerContainer = style({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#F8F8F8",
});

// components/music-player/index.tsx
import * as styles from "./styles.css";

export const MusicPlayer: FC = () => {
  return <div className={styles.playerContainer}>...</div>;
};
```

**メリット**:
- タイポ防止（存在しないクラス名はコンパイルエラー）
- 未使用スタイルの自動除外

---

## 開発ワークフロー

### 日常的なコマンド

```bash
# 開発サーバー起動（Cloudflare Pages環境）
npm run dev

# 型チェック
npm run type-check

# Lint実行
npm run lint

# フォーマット
npm run fmt

# テスト実行
npm test

# Storybook起動
npm run storybook

# 本番ビルド
npm run build
```

### データベース操作

```bash
# スキーマからマイグレーションファイル生成
npm run generate

# ローカルD1にマイグレーション適用
npm run migrate

# 本番D1にマイグレーション適用
npm run production-migrate
```

### Git運用

- **メインブランチ**: `main`
- **自動デプロイ**: `main`へのpushで自動的にCloudflare Pagesにデプロイ

---

## 実装パターンと実例

### パターン1: サービス層の実装（Core Layer）

**ファイル**: `src/services/player.ts`

```typescript
import { BehaviorSubject, type Observable, map } from "rxjs";

export interface MusicPlayer {
  getIsPlaying: Observable<boolean>;  // 読み取り専用のObservable
  play: () => Promise<void>;
  pause: () => Promise<void>;
}

export const createMusicPlayer = (playlist: Playlist): MusicPlayer => {
  const audio = new Audio();
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  return {
    // Observableとして公開（Subjectは隠蔽）
    getIsPlaying: isPlayingSubject,

    play: async () => {
      await audio.play();
      isPlayingSubject.next(true);  // 状態更新
    },

    pause: async () => {
      audio.pause();
      isPlayingSubject.next(false);
    },
  };
};
```

**ポイント**:
- Factory関数（`create`プレフィックス）でインスタンス生成
- BehaviorSubjectで状態管理、Observableとして公開
- React非依存（services層はフレームワーク非依存）

### パターン2: Bridge LayerでReact Hooksを提供

**ファイル**: `src/react/player.ts`

```typescript
import { useEffect, useMemo, useState } from "react";
import { distinctUntilChanged } from "rxjs";
import { createMusicPlayer } from "@services/player";

// Singleton管理
let player: MusicPlayer | null = null;

const createSingletonPlayer = (playlist: Playlist): MusicPlayer => {
  if (!player) {
    player = createMusicPlayer(playlist);
  }
  return player;
};

export const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const musicPlayer = useMemo(() => createSingletonPlayer(playlist), []);

  // Observable購読 → React State更新
  useEffect(() => {
    const subscription = musicPlayer.getIsPlaying
      .pipe(distinctUntilChanged())  // 変化時のみ通知
      .subscribe(setIsPlaying);

    return () => subscription.unsubscribe();  // クリーンアップ
  }, [musicPlayer]);

  return {
    isPlaying,
    play: musicPlayer.play,
    pause: musicPlayer.pause,
  };
};
```

**ポイント**:
- Singletonパターンで1つのインスタンスを共有
- `distinctUntilChanged()`で無駄な再レンダリングを防止
- `useEffect`でObservable購読、クリーンアップも忘れずに

### パターン3: Presentation Layerの実装

**ファイル**: `src/components/music-player/index.tsx`

```typescript
import type { FC } from "react";
import { useMusicPlayer } from "@react/player";
import * as styles from "./styles.css";

export const MusicPlayer: FC = () => {
  const {
    isPlaying,
    play,
    pause,
    // ... 他のstate/メソッド
  } = useMusicPlayer();  // Bridge Layerから取得

  return (
    <div className={styles.playerContainer}>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? "一時停止" : "再生"}
      </button>
    </div>
  );
};
```

**ポイント**:
- ビジネスロジックは一切含まない（UIの表示のみ）
- すべてのロジックはHooksから取得
- 条件分岐は表示制御のみ

### パターン4: Result型によるエラーハンドリング

**ファイル**: `src/utils/dom/get-element-by-id/index.tsx`

```typescript
import { err, ok, type Result } from "neverthrow";

export const getElementById = (id: string): Result<HTMLElement, string> => {
  const element = document.getElementById(id);
  return element !== null ? ok(element) : err("Element not found");
};

// 使用例（src/index.tsx）
getElementById("app").match(
  (element) => {
    // 成功時の処理
    createRoot(element).render(<App />);
  },
  (error) => {
    // 失敗時の処理
    alert(error);
  }
);
```

**ポイント**:
- `null`チェックの代わりにResult型を使用
- `.match()`でエラーハンドリングを強制
- 型レベルでエラーを表現

### パターン5: Drizzle ORMのスキーマ定義

**ファイル**: `db/schema/tracks.ts`

```typescript
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const tracks = sqliteTable('tracks', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
}, (track) => ({
  nameIdx: uniqueIndex('nameIdx').on(track.name),
  urlIdx: uniqueIndex('urlIdx').on(track.url),
}));
```

**ポイント**:
- SQLiteテーブルを型安全に定義
- ユニークインデックスも宣言的に記述
- マイグレーションは`npm run generate`で自動生成

---

## よくあるタスク

### 新しいコンポーネントを追加する

1. **ディレクトリを作成**
   ```bash
   mkdir -p src/components/new-component
   ```

2. **コンポーネントファイルを作成**
   ```typescript
   // src/components/new-component/index.tsx
   import type { FC } from "react";
   import * as styles from "./styles.css";

   export const NewComponent: FC = () => {
     return <div className={styles.container}>Hello</div>;
   };
   ```

3. **スタイルファイルを作成**
   ```typescript
   // src/components/new-component/styles.css.ts
   import { style } from "@vanilla-extract/css";

   export const container = style({
     padding: "16px",
   });
   ```

4. **Storybookを追加（オプション）**
   ```typescript
   // src/components/new-component/new-component.stories.tsx
   import type { Meta, StoryObj } from "@storybook/react";
   import { NewComponent } from "./index";

   const meta: Meta<typeof NewComponent> = {
     component: NewComponent,
   };

   export default meta;
   type Story = StoryObj<typeof NewComponent>;

   export const Default: Story = {};
   ```

### 新しいサービスを追加する

1. **Core Layerに実装**
   ```typescript
   // src/services/new-service.ts
   import { BehaviorSubject, type Observable } from "rxjs";

   export interface NewService {
     getData: Observable<string>;
     updateData: (value: string) => Promise<void>;
   }

   export const createNewService = (): NewService => {
     const dataSubject = new BehaviorSubject<string>("");

     return {
       getData: dataSubject,
       updateData: async (value: string) => {
         dataSubject.next(value);
       },
     };
   };
   ```

2. **Bridge LayerにHooksを追加**
   ```typescript
   // src/react/new-service.ts
   import { useEffect, useMemo, useState } from "react";
   import { createNewService } from "@services/new-service";

   export const useNewService = () => {
     const [data, setData] = useState("");
     const service = useMemo(() => createNewService(), []);

     useEffect(() => {
       const subscription = service.getData.subscribe(setData);
       return () => subscription.unsubscribe();
     }, [service]);

     return {
       data,
       updateData: service.updateData,
     };
   };
   ```

3. **コンポーネントで使用**
   ```typescript
   import { useNewService } from "@react/new-service";

   export const MyComponent: FC = () => {
     const { data, updateData } = useNewService();
     return <div>{data}</div>;
   };
   ```

### データベーススキーマを変更する

1. **スキーマファイルを編集**
   ```typescript
   // db/schema/tracks.ts
   export const tracks = sqliteTable('tracks', {
     id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
     name: text('name').notNull(),
     url: text('url').notNull(),
     duration: integer('duration').notNull(),  // 新しいカラム
   });
   ```

2. **マイグレーションファイルを生成**
   ```bash
   npm run generate
   ```

3. **ローカルD1に適用**
   ```bash
   npm run migrate
   ```

4. **本番環境に適用**
   ```bash
   npm run production-migrate
   ```

---

## デプロイ

### 自動デプロイ

`main`ブランチへpushすると、Cloudflare Pagesが自動的にビルド・デプロイを実行します。

```bash
git add .
git commit -m "feat: 新機能を追加"
git push origin main
```

### デプロイ状況の確認

Cloudflare Pagesのダッシュボードで確認できます。
デプロイ完了後、https://music-player.nagotzi.com/ にアクセスして動作確認を行います。

### 環境変数

環境変数が必要な場合は、Cloudflare Pagesの設定から追加します。
ローカル開発では `.env` ファイルを使用します（`.gitignore`に追加済み）。

---

## トラブルシューティング

### 開発サーバーが起動しない

```bash
# node_modulesとキャッシュを削除して再インストール
rm -rf node_modules .wrangler dist
npm install
npm run dev
```

### 型エラーが表示される

```bash
# 型チェックを実行して詳細を確認
npm run type-check
```

### ESLintエラー: `src/` からのインポート

```typescript
// ❌ Bad
import { Track } from "src/services/types";

// ✅ Good
import type { Track } from "@services/types";
```

### Observableの購読が漏れている

```typescript
// ❌ Bad: unsubscribeしていない
useEffect(() => {
  musicPlayer.getIsPlaying.subscribe(setIsPlaying);
}, []);

// ✅ Good: クリーンアップ関数でunsubscribe
useEffect(() => {
  const subscription = musicPlayer.getIsPlaying.subscribe(setIsPlaying);
  return () => subscription.unsubscribe();
}, []);
```

### D1マイグレーションが失敗する

```bash
# .envファイルが正しく設定されているか確認
cat .env

# Wranglerの認証状態を確認
wrangler whoami

# 再度マイグレーション実行
npm run migrate
```

---

## 参考資料

- **設計思想**: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- **基本情報**: [`README.md`](../README.md)
- **TypeScript設定**: [`tsconfig.json`](../tsconfig.json)
- **ESLint設定**: [`.eslintrc.cjs`](../.eslintrc.cjs)
- **Vite設定**: [`vite.config.ts`](../vite.config.ts)

### 外部ドキュメント

- [RxJS公式ドキュメント](https://rxjs.dev/)
- [vanilla-extract公式ドキュメント](https://vanilla-extract.style/)
- [Drizzle ORM公式ドキュメント](https://orm.drizzle.team/)
- [neverthrow公式ドキュメント](https://github.com/supermacro/neverthrow)
- [Cloudflare Pages公式ドキュメント](https://developers.cloudflare.com/pages/)

---

## チェックリスト

新機能を追加する際は、以下を確認してください：

- [ ] **Core Layer**: ビジネスロジックは`services/`に配置し、React/Vue等に依存していないか？
- [ ] **Bridge Layer**: UIフレームワーク固有の変換は`react/`等に隔離されているか？
- [ ] **Presentation Layer**: コンポーネントは純粋か？（props受取 → UI描画のみ）
- [ ] **Error Handling**: `null`/`undefined` ではなくResult型を使っているか？
- [ ] **Import**: パスエイリアス（`@services/*`など）を使用しているか？
- [ ] **Type Import**: `import type` で型のみのインポートを明示しているか？
- [ ] **Styling**: vanilla-extractで型安全にスタイルを記述しているか？
- [ ] **Observable**: `subscribe()`したObservableは必ず`unsubscribe()`しているか？
- [ ] **Test**: 新しいロジックにテストを追加したか？

---

このオンボーディング資料で不明点があれば、チームメンバーに質問してください。
Happy Coding!
