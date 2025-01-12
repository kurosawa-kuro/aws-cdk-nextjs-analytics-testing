import type { NextConfig } from "next";
import { config } from 'dotenv';

// 環境変数の読み込み
const { parsed: localEnv } = config({
  path: '../../.env'
});

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ENVIRONMENT: localEnv?.NEXT_PUBLIC_ENVIRONMENT || 'development',
    NEXT_PUBLIC_AWS_ACCOUNT_ID: localEnv?.NEXT_PUBLIC_AWS_ACCOUNT_ID,
    NEXT_PUBLIC_AWS_REGION: localEnv?.NEXT_PUBLIC_AWS_REGION,
    
    // サーバーサイドのみの環境変数
    SECRET_NAME: localEnv?.SECRET_NAME,
    DB_HOST: localEnv?.DB_HOST,
    DB_PORT: localEnv?.DB_PORT,
    DB_NAME: localEnv?.DB_NAME,
    DB_USER: localEnv?.DB_USER,
    DB_PASSWORD: localEnv?.DB_PASSWORD
  },
  /* config options here */
};

export default nextConfig;
