cat << 'EOF' > README.md
# ジュニアバレーボール・スケジュール管理アプリ

ジュニアバレーボールチーム（男子・女子・混合）の練習・試合予定を共有・管理するためのWebアプリです。
父母会長（管理者）が登録した予定を、保護者がカレンダー形式で簡単に確認できることを目的としています。

## 🚀 技術スタック
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Auth:** NextAuth.js (Credentials Provider)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Validation:** Zod
- **Styling:** Tailwind CSS
- **Date Handling:** date-fns

## 📂 ディレクトリ構成
```text
app/
├── (root)/          # 公開トップページ
├── (auth)/          # ログイン関連（layout.tsx, login/page.tsx）
├── (schedule)/      # メイン機能（カレンダー表示、予定登録）
├── api/             # NextAuth 認証エンドポイント
components/          # 再利用可能なUI部品（Calendar, Forms等）
lib/                 # 共通ロジック（Prisma設定, Auth設定, バリデーション）
prisma/              # DBスキーマ定義
```

## 🗄️ データ設計概要
### User (ユーザー)
項目.          物理名.      型.         制約.         説明.    
メールアドレス.  email.      String.     PK.          ログイン用ID
名前.          name.       String      Not Null.     画面表示用
学年.          grade.      Int.        Not Null.    1〜6年生 (Check 1-6)
管理者フラグ.   isAdmin.    Boolean.     -            Default:false
                                                    true: 父母会長（登録可）

### Schedule (スケジュール)
項目	       物理名	    型	        制約	      説明
ID	          id	      Int	      PK, 採番	    自動採番
日付	       date	       DateTime	   Not Null	    予定日
タイトル	   title	   String	    Not Null	 練習、練習試合、大会等
時間	      time	       String	   -	         例：「9:00 - 12:00」
場所	      location	   String	   Not Null	     体育館名など
対象	      target	   Enum	       Not Null	     ALL, 男子, 女子A 等

## 📐 デザインガイドライン (SP優先)
・ヘッダー高さ: 120px
・入力フォーム高さ: 48px 〜 54px (推奨)
・フォントサイズ: ラベル 12px(Bold) / 入力・プレースホルダー 20px 
・タップ領域: 44px × 44px 以上を確保
・モーダル「×」ボタン: 44px × 44px のタップ領域を確保

## 🏃‍♂️ 開発・運用ルール
・ユーザー管理: 管理者がDB（Neon/Prisma Studio）から直接登録。
　一般向け新規登録画面は作成しない。
・カレンダー: date-fns を使用し、自作のレスポンシブカレンダーを実装。
・タイムパフォーマンス: AIを活用し、テストコードは省略。動作優先で開発する。

## 📝 セットアップ
1）.env に DATABASE_URL を設定
2）npm install
3）npx prisma db push (DBへの反映)
4）npm run dev EOF

