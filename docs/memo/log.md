```typescript
// src/utils/logger.ts

import winston from 'winston';
import { FirehoseClient, PutRecordCommand } from "@aws-sdk/client-firehose";
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

// ログフォーマットの定義
interface LogFormat {
  timestamp: string;
  level: string;
  message: string;
  [key: string]: any; // 追加フィールド用
}

// 共通のログトランスポートクラス
class DualLogTransport extends winston.Transport {
  private firehoseClient: FirehoseClient;
  private cloudWatchClient: CloudWatchLogsClient;
  private streamName: string;
  private logGroupName: string;
  private logStreamName: string;

  constructor(options: any) {
    super(options);
    
    // AWS Clients初期化
    this.firehoseClient = new FirehoseClient({
      region: options.region || 'ap-northeast-1'
    });
    this.cloudWatchClient = new CloudWatchLogsClient({
      region: options.region || 'ap-northeast-1'
    });

    this.streamName = options.streamName;
    this.logGroupName = options.logGroupName;
    this.logStreamName = options.logStreamName || new Date().getTime().toString();
  }

  // ログエントリのフォーマット
  private formatLogEntry(info: any): LogFormat {
    return {
      timestamp: new Date().toISOString(),
      level: info.level,
      message: info.message,
      ...info.metadata,
      environment: process.env.NODE_ENV || 'development',
      service: 'nextjs-app'
    };
  }

  async log(info: any, callback: () => void) {
    try {
      const logEntry = this.formatLogEntry(info);

      // Firehoseへの送信
      await this.sendToFirehose(logEntry);
      
      // CloudWatchへの送信
      await this.sendToCloudWatch(logEntry);

      callback();
    } catch (error) {
      console.error('Logging error:', error);
      callback();
    }
  }

  private async sendToFirehose(logEntry: LogFormat) {
    const command = new PutRecordCommand({
      DeliveryStreamName: this.streamName,
      Record: {
        Data: Buffer.from(JSON.stringify(logEntry) + '\n')
      }
    });

    await this.firehoseClient.send(command);
  }

  private async sendToCloudWatch(logEntry: LogFormat) {
    const command = new PutLogEventsCommand({
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: [{
        timestamp: Date.now(),
        message: JSON.stringify(logEntry)
      }]
    });

    await this.cloudWatchClient.send(command);
  }
}

// ロガーの作成
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.metadata(),
    winston.format.json()
  ),
  transports: [
    new DualLogTransport({
      streamName: 'cdkjavascript01-stream',
      logGroupName: '/aws/cloudwatch-logs/cdkjavascript01-logs',
      region: 'ap-northeast-1'
    }),
    // 開発環境用のコンソール出力
    process.env.NODE_ENV !== 'production' && new winston.transports.Console({
      format: winston.format.simple()
    })
  ].filter(Boolean)
});

// 使用例
logger.info('User action logged', {
  metadata: {
    userId: '123',
    action: 'file_upload',
    fileSize: 1024,
    fileType: 'image/jpeg'
  }
});
```

このコードの特徴：

1. CloudWatchとFirehose両方に同じログを送信
2. カスタマイズ可能なログフォーマット
3. 環境に応じた条件付きログ出力
4. エラーハンドリング
5. タイムスタンプと環境情報の自動付加

使用例：
```typescript
// APIルートやページコンポーネントで
import { logger } from '../utils/logger';

export default async function handler(req, res) {
  logger.info('API request received', {
    metadata: {
      method: req.method,
      path: req.url,
      query: req.query,
      ip: req.headers['x-forwarded-for']
    }
  });

  try {
    // 処理
  } catch (error) {
    logger.error('Error in API handler', {
      metadata: {
        error: error.message,
        stack: error.stack
      }
    });
  }
}
```