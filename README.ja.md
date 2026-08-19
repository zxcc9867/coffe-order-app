# COZY コーヒー注文アプリ

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

顧客の注文操作から、スタッフによる注文ステータス・在庫管理までを一つのフローとして実装したフルスタック Web アプリです。

[公開アプリを開く](https://coffe-order-app-frontend.onrender.com/)

## プロジェクトの目的

顧客の選択、注文状態の遷移、在庫更新、運用統計、REST API、リレーショナルデータベースを接続し、小規模店舗の業務フローを再現しています。

## ユーザーフロー

| 利用者 | フロー |
| --- | --- |
| 顧客 | メニュー閲覧 → オプション選択 → カート追加 → 数量調整 → 注文確定 |
| スタッフ | 新規注文確認 → 調理開始 → 完了処理 → 在庫確認・調整 |
| 運用担当 | 全体・受付・調理中・完了の件数を確認 |

## 主な機能

- 画像・価格・オプションを含むメニューカード
- カート内の数量変更と注文完了フィードバック
- 受付、調理中、完了の注文状態管理
- 注文データから集計するダッシュボード
- 在庫確認、手動調整、状態更新に連動する在庫減算
- API と PostgreSQL 接続のヘルスチェック
- 顧客画面と管理画面のレスポンシブ対応

## 技術スタック

| レイヤー | 技術 |
| --- | --- |
| フロントエンド | React 19, Vite 7 |
| バックエンド | Node.js 18+, Express 4 |
| データベース | PostgreSQL |
| デプロイ | Render |

## アーキテクチャ

```text
React client (ui)
  └─ VITE_API_URL 経由の REST
       └─ Express API (server)
            ├─ /api/menus
            ├─ /api/orders
            ├─ /api/stock
            └─ PostgreSQL
```

```text
coffe-order-app/
├── ui/
├── server/
│   └── scripts/init-db.js
├── DEPLOY-RENDER.md
└── PRD-화면.md
```

## ローカル実行

PostgreSQL に `coffe_order` データベースを作成し、API を起動します。

```bash
cd server
cp .env.example .env
npm install
node scripts/init-db.js
npm run dev
```

別のターミナルで Web クライアントを起動します。

```bash
cd ui
cp .env.example .env
npm install
npm run dev
```

API は [http://localhost:3000](http://localhost:3000)、クライアントは [http://localhost:5173](http://localhost:5173) で動作します。

## 環境変数

| 場所 | 変数 | 用途 |
| --- | --- | --- |
| `server` | `PORT` | Express ポート。既定値は `3000` |
| `server` | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | ローカル PostgreSQL 接続 |
| `server` | `DATABASE_URL` | ホスト環境の接続文字列 |
| `ui` | `VITE_API_URL` | Express API の公開ベース URL |

実際の認証情報やローカルの `.env` はコミットしないでください。

## API 概要

| メソッド | パス | 役割 |
| --- | --- | --- |
| GET | `/api/health`, `/api/health/db` | プロセスと DB の確認 |
| GET | `/api/menus` | メニュー一覧 |
| GET, POST | `/api/orders` | 注文一覧・作成 |
| GET | `/api/orders/stats` | 注文状態の集計 |
| PATCH | `/api/orders/:id` | 状態変更と在庫処理 |
| GET, PATCH | `/api/stock` | 在庫取得・調整 |

## 検証

```bash
cd ui
npm run lint
npm run build
```

バックエンドのヘルスエンドポイントを確認し、注文後に管理画面、統計、状態遷移、在庫の整合性を確認します。

## デプロイ

フロントエンドとバックエンドは別々の Render サービスとしてデプロイします。詳細は [DEPLOY-RENDER.md](DEPLOY-RENDER.md) を参照してください。

## 現在の範囲とセキュリティ

本リポジトリはポートフォリオ兼学習用です。現在の管理画面と更新 API には認証・ロールベースの権限制御がありません。本番利用には、スタッフ認証、API 認可、制限付き CORS、入力検証、レート制限、監査ログ、より厳密な在庫トランザクションが必要です。

## ライセンス

ISC
