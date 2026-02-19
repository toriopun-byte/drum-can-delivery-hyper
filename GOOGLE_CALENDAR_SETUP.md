# Google Calendar API 連携設定

## 1. Google Cloud Console での設定

### サービスアカウントの作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成または選択
3. 「IAMと管理」→「サービスアカウント」に移動
4. 「サービスアカウントを作成」をクリック
5. 以下の情報を入力：
   - サービスアカウント名: `drum-can-delivery`
   - 説明: `ドラム缶風呂レンタル予約システム`
6. 「作成して続行」をクリック
7. 「ロールを選択」で「プロジェクト」→「編集者」を選択
8. 「続行」→「完了」をクリック

### キーの作成
1. 作成したサービスアカウントをクリック
2. 「キー」タブに移動
3. 「キーを追加」→「新しいキーを作成」
4. 「JSON」を選択して「作成」
5. ダウンロードされたJSONファイルを安全に保存

## 2. Google Calendar の共有設定

1. [Google Calendar](https://calendar.google.com/) にアクセス
2. 予約管理用のカレンダーを作成（または既存のカレンダーを使用）
3. カレンダーの設定（歯車アイコン）を開く
4. 「特定のユーザーとの共有」をクリック
5. サービスアカウントのメールアドレスを追加：
   - JSONファイルの `client_email` をコピー
   - 権限: 「予定の変更権限」を付与
6. 「保存」をクリック

## 3. Cloudflare Pages の環境変数設定

以下の環境変数を Cloudflare Pages に設定：

### Google Calendar API 用
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

### Resend メール用
```
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=your-email@domain.com
```

## 4. カレンダーでの予約管理方法

### 予約可能日の設定
- 何も入力しない日 = 予約可能（◯表示）

### 予約済みの設定
- 予約が入ったら自動で「【予約済み】裸一缶 ドラム缶風呂レンタル」が登録されます
- 手動で予約済みにする場合：
  - 予定を作成
  - タイトルに「予約済み」を含める
  - 例: 「予約済み - 山田様」

### 予約不可日の設定
- 休業日やメンテナンス日などを設定
- 予定を作成してタイトルに「予約不可」を含める
- 例: 「予約不可 - 定休日」
- 例: 「予約不可 - メンテナンス」

## 5. 予約ステータスの表示ルール

サイトのカレンダーでは以下のように表示されます：

- **◯** (青): 予約可能
  - Googleカレンダーに予定がない日
  
- **×** (赤): 予約済み  
  - タイトルに「予約済み」を含む予定がある日
  
- **-** (灰): 予約不可
  - 過去の日付
  - タイトルに「予約不可」を含む予定がある日

## 6. 予約処理の流れ

1. お客様がサイトで予約フォームを送信
2. Googleカレンダーに「【予約済み】」イベントが自動登録
3. お客様に予約確認メールが送信
4. 管理者（drumcandelivery@gmail.com）に通知メールが送信
5. サイトのカレンダーが自動的に更新

## 7. トラブルシューティング

### 予約処理が失敗する場合
1. 環境変数が正しく設定されているか確認
2. Google Calendar APIが有効になっているか確認
3. サービスアカウントの権限を確認
4. カレンダーの共有設定を確認

### カレンダーが更新されない場合
1. ブラウザのキャッシュをクリア
2. APIのレスポンスを確認（開発者ツール）
3. Googleカレンダーのイベント形式を確認

---

この設定で、Googleカレンダーと完全に連動した予約システムが動作します。
