# おはなしメモ

認知症初期の方向けAI見守りPWAアプリのMVP。

## 起動方法

```bash
cd ohanashi-memo
npm install
npm run dev -- -p 3456
```

`http://localhost:3456` でアクセス。

## 画面構成

### 母側（メイン）
- `/` - ホーム（日付、メモサマリー、3つのメインボタン）
- `/talk` - 今日のおはなし（AIチャット、3分タイマー、状態表示）
- `/previous` - 前の会話を振り返る（会話カード一覧）
- `/contact` - 家族に連絡（家族一覧）
- `/contact/[id]` - 電話/メッセージ選択
- `/contact/[id]/message` - 入力方法選択
- `/contact/[id]/message/simple` - かんたんメッセージ（確認画面付き）
- `/contact/[id]/message/voice` - 声で入力する（モック）
- `/contact/[id]/message/text` - 文字で入力する

### 家族側
- `/family` - 今日の様子ダッシュボード
- `/family/conversations` - 会話の記録（詳細・声かけ案）
- `/family/memos` - メモ確認（完了/残す/削除・確認が必要フィルタ）
- `/family/contacts` - 家族連絡先管理（連絡履歴）
- `/family/settings` - 設定

## 技術スタック

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase（オプション、未設定時はモックデータで動作）
- PWA (manifest.json + service worker)
- React Context（状態管理）

## Supabase接続（オプション）

1. Supabaseプロジェクトを作成
2. `supabase/schema.sql` を SQL Editor で実行
3. `supabase/seed.sql` を実行（初期データ投入）
4. `.env.local` を作成:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. `npm run dev` で再起動

環境変数未設定の場合はモックデータで動作します。

## 動作確認

### 母側
1. ホームに日付と3つの大きなボタンが表示される
2. 「今日のおはなし」→ AIと会話 → 3分タイマー → 終了 → ログ保存
3. 「前の会話を振り返る」→ カード一覧 → 「この話をする」
4. 「家族に連絡」→ 家族選択 → 電話/メッセージ → 入力方法選択 → 送信
5. メモがある場合ホームにメモサマリー表示

### 家族側
1. 利用回数・最終利用・合計時間が表示される
2. 未利用時「お声がけをおすすめします」表示
3. 会話の記録 → 話題・気分・声かけ案
4. メモ確認 → 完了/残す/削除・「確認が必要」フィルタ
5. 家族連絡先 → 連絡履歴表示
