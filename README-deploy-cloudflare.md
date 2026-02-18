# Cloudflare Pages へのデプロイ手順

このドキュメントはこのリポジトリ（Next.js プロジェクト）を Cloudflare Pages にデプロイするための手順をまとめたものです。

前提
- Node.js (推奨: 18+) がローカル環境にインストールされていること
- pnpm を使うことを想定（`pnpm-lock.yaml` がリポジトリにあります）。npm/yarn でも可
- Cloudflare アカウントを持っていること、Cloudflare Pages を使えること

このリポジトリの現状
- Next.js: 16.1.6
- `app/` ディレクトリあり（App Router）
- `next.config.mjs` に `output: "export"` が設定されており、**完全静的サイト**として Cloudflare Pages で配信する構成です
- ビルドは `pnpm build`（`next build`）で `out/` が生成されます
- お問い合わせ・予約フォームはサーバー不要の **mailto:** リンクでメール送信します
- カレンダー空き状況はクライアント側のデモデータで表示します（API 不要）

推奨のデプロイ方式（まずはこちら）: 静的エクスポートを Cloudflare Pages で配信

1. Cloudflare Pages でプロジェクトを作成
   - Cloudflare にログイン → Pages を開き「Create a project」
   - GitHub/GitLab/Bitbucket と連携し、このリポジトリを選択

2. ビルド設定
   - Framework preset: None（または Custom）
   - Install command: pnpm install
   - Build command: pnpm build
   - Build output directory: out

3. 環境変数
   - ビルドや実行に必要な環境変数があれば Pages の「Environment variables」へ追加してください。
   - Node.js のバージョンを明示したい場合は `NODE_VERSION` を設定（例: 18）。

4. デプロイ実行
   - Cloudflare Pages の UI から Deploy を実行します。初回は依存関係のインストールとビルドが走ります。

ローカルで事前にビルド確認する手順

```bash
# リポジトリルートで
pnpm install
pnpm build   # これで out/ が生成されるはずです

# 確認用にローカル静的サーバで表示
# (serve がない場合はインストール: pnpm add -g serve)
npx serve out
```

注意点 / トラブルシュート
- `next.config.mjs` に `trailingSlash: true` が設定されているため、出力は各ページがディレクトリ（例: `/about/index.html`）に配置されます。リンクやリダイレクト設定に注意してください。
- `images.unoptimized: true` が設定されているため、Next.js の Image 最適化機能は使われません（静的なイメージのまま配信されます）。必要なら Cloudflare Images や別の最適化を検討してください。
- このプロジェクトは API ルート・Server Actions を削除し、静的サイト用に mailto とクライアント側デモデータに置き換えています。動的機能が必要なら「Next on Pages」を検討してください。

オプション: Next on Pages（Edge / SSR）を使う場合（高度な設定）

このリポジトリには `@cloudflare/next-on-pages` が devDependencies に含まれています。Next on Pages を使うと Cloudflare の Edge 上で Next.js の一部の SSR/動的機能を動かせますが、作業は以下のようにやや増えます。

- 主な違い:
  - `next.config.mjs` の `output: "export"` を取り除く、または適切に変更する必要があります。
  - Cloudflare Pages のビルドコマンドやスクリプトを `next build` と `next-on-pages` 実行に合わせて調整します。
  - サーバー側の実行環境（Edge 関数）に合わせた修正・検証が必要です。

参考: Cloudflare の公式ドキュメント（Next on Pages）を参照してください。

追加で私ができること
- このまま静的デプロイでよければ、Pages 接続手順（UI のスクショや設定値）を含めた詳細な `README-deploy-cloudflare.md` をさらに拡充します。
- Next on Pages 方式でのセットアップを希望する場合は、`next.config.mjs` の変更案、package.json の追加スクリプト、及び Cloudflare Pages サイドの設定例を作成して、動作確認まで行います。

---

作業履歴
- 静的サイト化のため、`app/api/` および `app/actions/` を削除し、お問い合わせ・予約を mailto、カレンダーをクライアント側デモデータに変更済みです。ビルドは `pnpm build` で `out/` が出力されます。

EOF
