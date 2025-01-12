import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// 必須環境変数とその説明
const REQUIRED_ENV_VARS = {
  NEXT_PUBLIC_AWS_ACCOUNT_ID: 'AWSアカウントID',
  NEXT_PUBLIC_AWS_REGION: 'AWSリージョン',
  NEXT_PUBLIC_APP_ENV: '環境（development/staging/production）',
  AWS_SECRET_NAME: 'シークレットマネージャーのシークレット名'
};

// 環境変数の存在チェック
function checkEnvVars() {
  const envPath = join(process.cwd(), '../../.env');
  
  if (!existsSync(envPath)) {
    console.error('❌ .envファイルが見つかりません');
    process.exit(1);
  }

  const envContent = readFileSync(envPath, 'utf8');
  const missingVars = Object.keys(REQUIRED_ENV_VARS).filter(v => {
    const regex = new RegExp(`^${v}=`, 'm');
    return !regex.test(envContent);
  });

  if (missingVars.length > 0) {
    console.error('❌ 以下の必須環境変数が不足しています:');
    missingVars.forEach(v => {
      console.error(`- ${v}: ${REQUIRED_ENV_VARS[v]}`);
    });
    process.exit(1);
  }

  console.log('✅ 環境変数のチェックに成功しました');
}

checkEnvVars(); 