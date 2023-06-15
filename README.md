# Music Player

## Description

ローカルから楽曲ファイルを読み込み、再生することができるアプリケーション

## Installation

```
npm install
```

## Development

```
npm run dev
```

### 各ディレクトリの役割

- src/components: コンポーネント
- src/views: UI
- src/react: React のエントリーポイント
- src/services: ヘッドレスアプリケーション
- src/assets: 静的ファイル

## デプロイ

cloudflare pages を使ってデプロイしている
main に push すると自動でデプロイされる
[ページ](https://music-player.nagotzi.com/)

## tech stack

- React
- TypeScript
- RxJS
- vanilla-extract
- Vite
- cloudflare pages
