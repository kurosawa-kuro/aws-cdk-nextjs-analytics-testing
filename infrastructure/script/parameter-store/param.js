// config.js
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const _ = require('lodash');

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

    // 環境変数で上書き
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

// 使用例
async function initializeApp() {
  try {
    const configManager = new ConfigManager();
    const config = await configManager.getConfig();

    console.log('config:', config);
    console.log('S3 Bucket:', config.storage.s3Bucket);
    console.log('Environment:', config.app.env);
    console.log('S3 Bucket:', config.storage.s3Bucket);
    
    return config;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
}

// エクスポート
module.exports = { ConfigManager, initializeApp };

// スクリプト実行時にinitializeAppを呼び出す
(async () => {
  await initializeApp();
})();