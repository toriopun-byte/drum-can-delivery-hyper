# Cloudflare Pages デプロイ手順

## 1. 変更を GitHub に push

```bash
git add .
git commit -m "feat: Google Calendar + Resend + cf:build for Cloudflare Pages"
git push origin main
```

push 後、Cloudflare Pages の「再デプロイ」でビルドが走ります。

## 2. Cloudflare Pages のビルド設定（必須）

| 項目 | 値 |
|------|-----|
| **ビルドコマンド** | `npm run cf:build` または `pnpm run cf:build` |
| **ビルド出力ディレクトリ** | **`.vercel/output/static`**（先頭のスラッシュなし） |

※ ここが `/.vercel/output/static` や `.vercel/output` だけだと 404 になることがあります。必ず `.vercel/output/static` にしてください。

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

---

## 404 になる場合の確認

1. **ビルド出力ディレクトリ**
   - Cloudflare ダッシュボード → 該当プロジェクト → **Settings** → **Builds & deployments**
   - **Build configuration** の **Build output directory** が **`.vercel/output/static`** になっているか確認（先頭に `/` をつけない）。

2. **ビルド成功**
   - **Deployments** タブで、該当デプロイが成功（緑）になっているか確認。失敗していると 404 になります。

3. **本番 URL**
   - プレビュー URL（例: `463f65da.drum-can-delivery-hyper.pages.dev`）ではなく、本番の **Production URL**（例: `drum-can-delivery-hyper.pages.dev`）で開いてみる。

4. **まだ 404 のとき**
   - `@cloudflare/next-on-pages` は非推奨です。Cloudflare は [OpenNext (Cloudflare adapter)](https://opennext.js.org/cloudflare) への移行を推奨しています。移行すると 404 が解消することがあります。
