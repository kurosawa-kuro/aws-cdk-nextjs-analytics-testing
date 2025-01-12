import { writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import _ from 'lodash';

class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }
    ConfigManager.instance = this;
    
    this.ssmClient = new SSMClient({
      region: 'ap-northeast-1'
    });
    this.config = null;
  }

  async getConfig() {
    if (this.config) {
      return this.config;
    }

    if (process.env.APP_CONFIG) {
      try {
        this.config = JSON.parse(process.env.APP_CONFIG);
        validateConfig(this.config);
        return this.config;
      } catch (error) {
        console.warn('Failed to parse APP_CONFIG, falling back to SSM');
      }
    }

    try {
      const command = new GetParameterCommand({
        Name: '/cdkjavascript01',
      });

      const response = await this.ssmClient.send(command);
      const configValue = response.Parameter?.Value;

      if (!configValue) {
        throw new Error('Configuration not found');
      }

      this.config = JSON.parse(configValue);
      validateConfig(this.config);
      return this.config;

    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }
}

function validateConfig(config) {
  const requiredFields = [
    'app.env',
    'app.port',
    'storage.s3Bucket',
    'storage.cdnUrl',
    'aws.region',
    'aws.accountId'
  ];

  for (const field of requiredFields) {
    if (!_.get(config, field)) {
      throw new Error(`Missing required config field: ${field}`);
    }
  }
}

async function getSecrets() {
  const secret_name = process.env.SECRET_NAME || "javascript-app-credentials";
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "ap-northeast-1",
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error("Error retrieving secrets:", error);
    process.exit(1);
  }
}

async function generateEnv() {
  const envPath = join(process.cwd(), '../../.env');
  
  if (existsSync(envPath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(process.cwd(), `../../.env.backup-${timestamp}`);
    
    try {
      renameSync(envPath, backupPath);
      console.log(`⚠️ Existing .env file backed up to: ${backupPath}`);
    } catch (error) {
      console.error('❌ Failed to backup existing .env file:', error);
      process.exit(1);
    }
  }

  const secrets = await getSecrets();
  const configManager = new ConfigManager();
  const config = await configManager.getConfig();

  const envTemplate = `# ========================
# アプリケーション基本設定
# ========================
NEXT_PUBLIC_APP_ENV=${config.app.env}
NEXT_PUBLIC_APP_NAME=your_app_name
PORT=${config.app.port}
NEXT_PUBLIC_API_URL=http://localhost:${config.app.port}/api

# ========================
# データベース設定
# ========================
DATABASE_URL="postgresql://postgres:postgres@localhost/training"

# ========================
# AWS設定
# ========================
NEXT_PUBLIC_AWS_REGION=${config.aws.region}
NEXT_PUBLIC_AWS_ACCOUNT_ID=${config.aws.accountId}
AWS_ACCESS_KEY_ID=${secrets.AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${secrets.AWS_SECRET_ACCESS_KEY}
AWS_SECRET_NAME=${process.env.SECRET_NAME || "javascript-app-credentials"}
NEXT_PUBLIC_S3_BUCKET=${config.storage.s3Bucket}
NEXT_PUBLIC_CDN_URL=${config.storage.cdnUrl}

# ========================
# 認証設定
# ========================
AUTH_JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
COOKIE_SECRET=your_cookie_secret

# ========================
# Slack設定
# ========================
SLACK_WEBHOOK_URL=${secrets.SLACK_WEBHOOK_URL}
`;

  try {
    writeFileSync(envPath, envTemplate);
    console.log('✅ .env file generated successfully with secrets and config');
  } catch (error) {
    console.error('❌ Failed to write new .env file:', error);
    process.exit(1);
  }
}

generateEnv(); 