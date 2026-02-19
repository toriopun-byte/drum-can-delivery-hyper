# Cloudflare Pages デプロイ手順

## 1. 変更を GitHub に push

```bash
git add .
git commit -m "feat: Google Calendar + Resend + cf:build for Cloudflare Pages"
git push origin main
```

push 後、Cloudflare Pages の「再デプロイ」でビルドが走ります。

## 2. Cloudflare Pages のビルド設定

| 項目 | 値 |
|------|-----|
| **ビルドコマンド** | `npm run cf:build` または `pnpm run cf:build` |
| **ビルド出力ディレクトリ** | `.vercel/output/static` |

### `cf:build` がない場合（スクリプト未 push 時）

ビルドコマンドを次のどちらかに変更すれば、`package.json` に `cf:build` がなくてもビルドできます。

- **npm**: `npx @cloudflare/next-on-pages@latest`
- **pnpm**: `pnpm exec @cloudflare/next-on-pages@latest`

## 3. 環境変数（Settings → Environment variables）

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_CALENDAR_ID`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

以上を本番用に設定してください。
