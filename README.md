# aws-cdk-nextjs-analytics-testing
aws cdk nodejs typescript nextjs analytics testing

```
npx create-next-app@latest src --typescript --eslint --tailwind --src-dir --import-alias "@/*" --use-npm
```

```
pnpm create next-app@latest src --typescript --eslint --tailwind --src-dir --import-alias "@/*"
```

```
sudo mkdir -p /home/wsl/app
sudo chown -R wsl:wsl /home/wsl/app
```

```
cd /home/wsl/app
git clone git@github.com:kurosawa-kuro/aws-cdk-nextjs-analytics-testing.git .
```

```
sudo npm install -g aws-cdk

```

pnpm up -L

pnpm add -D aws-cdk@latest

```
cdk init app --language typescript

# npmのロックファイルとnode_modulesを削除
rm -rf package-lock.json node_modules

# pnpmの設定
pnpm import

# 依存関係のインストール
pnpm install

# CDK関連の依存関係を再インストール
pnpm add -D aws-cdk
```


### 代表的なディレクトリ構成
```markdown
src/
├── app/                # App Router（Next.js 13以降）
│   ├── (auth)/         # 認証関連のルートグループ
│   ├── (main)/         # メインコンテンツのルートグループ
│   ├── api/            # APIルート
│   ├── components/     # ページ固有のコンポーネント
│   ├── layouts/        # レイアウトコンポーネント
│   ├── lib/            # ユーティリティ関数やライブラリ
│   ├── middleware.ts   # ミドルウェア
│   ├── page.tsx        # ページコンポーネント
│   └── styles/         # スタイル関連ファイル
│
├── components/         # グローバルなUIコンポーネント
│   ├── common/         # 共通コンポーネント
│   ├── ui/             # UI部品（ボタン、カードなど）
│   └── layouts/        # グローバルレイアウト
│
├── hooks/              # カスタムフック
├── lib/                # ユーティリティ関数やライブラリ
├── middleware.ts       # ミドルウェア
├── pages/              # Pages Router（Next.js 12以前）
│   ├── api/            # APIルート
│   ├── _app.tsx        # カスタムAppコンポーネント
│   ├── _document.tsx   # カスタムDocumentコンポーネント
│   └── index.tsx       # ホームページ
│
├── public/             # 静的ファイル
│   ├── images/         # 画像ファイル
│   ├── fonts/          # フォントファイル
│   └── favicon.ico     # ファビコン
│
├── styles/             # グローバルスタイル
│   ├── globals.css     # グローバルCSS
│   ├── theme/          # テーマ関連
│   └── variables.css   # CSS変数
│
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
├── contexts/           # React Context
├── providers/          # プロバイダーコンポーネント
├── store/              # 状態管理（Reduxなど）
├── tests/              # テストファイル
└── config/             # 設定ファイル
```
