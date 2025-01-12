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
# npmのロックファイルとnode_modulesを削除
rm -rf package-lock.json node_modules

# pnpmの設定
pnpm import

# 依存関係のインストール
pnpm install

# CDK関連の依存関係を再インストール
pnpm add -D aws-cdk
```
