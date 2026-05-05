# Cellar App（フロントエンド）

ワインセラー在庫管理アプリのフロントエンドです。ユーザーがワインボトルを管理し、セラー内の配置を視覚的に確認できる Web アプリです。

> TODO: 画面URL（本番/ステージング）やデモアカウント情報があれば追記してください。

---

## 1. プロジェクト概要

- **目的**: ボトルの在庫・属性情報・セラー内配置をまとめて管理する
- **対象**: セラー（棚/スロット）を持つユーザー向け
- **前提**: バックエンドAPIとHTTPで連携（開発時は Vite のプロキシ経由）

## 2. 主な機能

- **ボトル一覧管理**: 一覧表示・検索/絞り込み（TODO: 実装状況に合わせて詳細化）
- **ワイン情報登録**: ワイン属性（産地/品種/タイプ等）の管理
- **セラー内スロット配置表示**: 視覚的な配置の確認（TODO: 対応画面の名称/URL）
- **ボトル配置編集**: 位置の更新（TODO: UI/操作手順）
- **統計表示**: ダッシュボード（Recharts）
- **モバイル対応UI**: Material UI + レスポンシブ（ハンバーガーメニュー）

## 3. スクリーンショット（プレースホルダ）

> TODO: `docs/` 等に画像を置いて差し替え

- ダッシュボード: `docs/screenshots/dashboard.png`
- ボトル一覧: `docs/screenshots/bottles.png`
- ワイン詳細: `docs/screenshots/wine-detail.png`

## 4. 技術スタック

- **React**（React 19）
- **TypeScript**
- **Vite**
- **Material UI**
- **React Router**
- **Axios**
- **Recharts**

補足:
- `vite.config.ts` で `@` を `src/` のエイリアスとして定義しています。

## 5. セットアップ手順（5分で起動）

前提: バックエンドが起動していること（または到達可能なAPIエンドポイントがあること）。

```bash
# 1) 依存関係をインストール
npm ci

# 2) 環境変数を用意（例は下記セクション参照）
cat > .env.local <<'EOF'
VITE_API_TARGET=http://cellar-app.local
EOF

# 3) 開発サーバ起動
npm run dev
```

- ブラウザで `http://localhost:5173` を開きます（Viteデフォルト）。
- API はフロントからは `/api` を叩き、Vite がバックエンドへプロキシします（詳細は「API連携方法」）。

> TODO: バックエンドの起動手順（別リポジトリ/compose/URL）へのリンクを追加してください。

## 6. 必要なNode.jsバージョン

- **推奨: Node.js 20 以上（LTS）**
- **npm**: Node同梱のもの

> TODO: `package.json` の `engines` が未設定のため、CI/実運用に合わせて明示してください。

## 7. 環境変数設定例

このプロジェクトは Vite の環境変数（`VITE_` プレフィックス）を使います。

`.env.local`（例）:

```dotenv
# バックエンドAPIのプロキシ先（Viteのdev serverが参照）
# 例: http://cellar-app.local や https://localhost:8443
VITE_API_TARGET=http://cellar-app.local
```

補足:
- `vite.config.ts` で `VITE_API_TARGET` が未指定の場合 `https://localhost:8443` を既定値にしています。

## 8. 利用可能なnpm scripts

`package.json` の scripts:

```bash
npm run dev      # 開発サーバ起動（Vite）
npm run build    # TypeScriptビルド + 本番ビルド（dist/）
npm run preview  # dist/ をローカルプレビュー
```

> TODO: lint/test を導入する場合は `npm run lint` / `npm test` 等を追加し、このREADMEにも追記してください。

## 9. ディレクトリ構成

主要構成（抜粋）:

```text
.
├─ public/                # 静的アセット
├─ src/
│  ├─ api/                # Axiosクライアント・APIラッパ
│  ├─ components/         # 共有UIコンポーネント
│  ├─ features/           # 機能単位（例: bottles/, wines/）
│  ├─ pages/              # ルーティング単位のページ
│  ├─ theme/              # MUIテーマ
│  ├─ types/              # 型定義
│  ├─ utils/              # 汎用ユーティリティ
│  ├─ App.tsx             # ルートコンポーネント（ルーティング/ナビ）
│  └─ main.tsx            # エントリポイント（axios初期化/Router/Theme）
├─ vite.config.ts
├─ tsconfig*.json
└─ package.json
```

> TODO: デザイン資産やAPI仕様書など、プロジェクト固有の配置があれば追記してください。

## 10. アーキテクチャ方針

- **ルーティング中心**: `src/pages/` にページを置き、`src/App.tsx` で `react-router-dom` の `Routes` を定義
- **機能単位の分割**: まとまった機能は `src/features/<domain>/` に寄せる（例: `bottles/`, `wines/`）
- **API層の分離**: `src/api/` に Axios client とエンドポイント別の API 関数を集約
- **UIの一貫性**: Material UI の `ThemeProvider`（`src/theme/`）を全体で使用

## 11. API連携方法

### 基本方針

- フロントエンドからは **常に `/api`** を baseURL としてアクセスします（`src/api/axiosClient.ts`）。
- 開発時は Vite dev server が `/api` をバックエンドへプロキシします（`vite.config.ts`）。

### プロキシの挙動（重要）

`VITE_API_TARGET` の値に応じて rewrite が変わります:

- **target に `localhost` を含む場合**: `/api` プレフィックスを削って転送  
  例: フロント `/api/wines` → バックエンド `http://localhost:XXXX/wines`
- **それ以外（例: `http://cellar-app.local`）**: `/api` を付けたまま転送  
  例: フロント `/api/wines` → バックエンド `http://cellar-app.local/api/wines`

> TODO: バックエンドの実際のパス設計（`/api` あり/なし）を整理し、どちらが正なのかをここに明記してください。

### Axiosの初期化

アプリ起動時に `initAxiosClient()` を呼んで Axios instance を初期化します（`src/main.tsx`）。

## 12. 開発ルール

- **言語/品質**
  - TypeScript を前提（型を付けてから実装する）
  - ESLint 設定あり（`eslint.config.js`）
- **命名/配置**
  - 画面 = `pages/`、機能 = `features/`、共通UI = `components/`、API = `api/`
  - import は `@/` エイリアスを優先して相対パス地獄を避ける
- **UI**
  - MUI のコンポーネントとテーマを優先（独自スタイルは必要最小限）

> TODO: フォーマッタ（Prettier 等）やコミット規約（Conventional Commits）を採用する場合は追記してください。

## 13. デプロイ方法

基本:

```bash
npm run build
```

- 生成物は `dist/` に出力されます。
- `dist/` を静的ホスティング（S3/CloudFront、Nginx、Vercel、Netlify 等）で配信します。
- SPA なので、ホスティング側で **任意パスを `index.html` にフォールバック**する設定が必要です。

> TODO: 実際のデプロイ先（例: Docker/Nginx、クラウド、CI/CD）に合わせて具体的な手順と設定ファイルの場所を追記してください。

## 14. 今後のロードマップ

- **テスト導入**: unit/integration（TODO: Vitest/RTL など方針決定）
- **APIエラーハンドリング強化**: トースト通知、リトライ、Sentry等（TODO）
- **認証/認可対応**: トークン管理、`withCredentials` 方針の整理（TODO）
- **セラー配置UIの強化**: ドラッグ&ドロップ、バリデーション（TODO）
- **パフォーマンス**: 画面分割、キャッシュ、一覧の仮想化（TODO）
