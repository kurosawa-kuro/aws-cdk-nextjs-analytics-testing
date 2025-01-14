import { CloudWatchLogsClient, PutLogEventsCommand, CreateLogStreamCommand, DescribeLogStreamsCommand } from "@aws-sdk/client-cloudwatch-logs";
import fs from 'fs';
import readline from 'readline';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールで__dirnameを使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .envファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('upload-cloudwatch.js');

// 環境変数の確認
console.log('AWS Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
console.log('AWS Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');

// AWS CloudWatch設定
const client = new CloudWatchLogsClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// CloudWatchの設定
const LOG_GROUP_NAME = 'ts-test-11';
const LOG_STREAM_NAME = `app-logs-${new Date().toISOString().split('T')[0]}`;

// ログストリームの存在確認と作成
async function ensureLogStream() {
  try {
    // ログストリームの存在確認
    const describeCommand = new DescribeLogStreamsCommand({
      logGroupName: LOG_GROUP_NAME,
      logStreamNamePrefix: LOG_STREAM_NAME
    });
    
    const streams = await client.send(describeCommand);
    const streamExists = streams.logStreams?.some(stream => stream.logStreamName === LOG_STREAM_NAME);
    
    if (!streamExists) {
      console.log('Creating new log stream:', LOG_STREAM_NAME);
      const createCommand = new CreateLogStreamCommand({
        logGroupName: LOG_GROUP_NAME,
        logStreamName: LOG_STREAM_NAME
      });
      await client.send(createCommand);
      console.log('Log stream created successfully');
    } else {
      console.log('Log stream already exists');
    }
  } catch (err) {
    console.error('Error ensuring log stream:', err);
    throw err;
  }
}

async function uploadLogsToCloudWatch(logData) {
  try {
    // ログストリームの確認と作成
    await ensureLogStream();

    const logEvent = {
      timestamp: new Date(logData.timestamp).getTime(),
      message: JSON.stringify(logData)
    };

    const command = new PutLogEventsCommand({
      logGroupName: LOG_GROUP_NAME,
      logStreamName: LOG_STREAM_NAME,
      logEvents: [logEvent]
    });

    const response = await client.send(command);
    console.log('Log uploaded successfully:', response);

  } catch (err) {
    console.error('Error uploading logs:', err);
  }
}

// テスト用のダミーログデータ
const testLogData = {
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'Test log message'
};

// テストログの送信
uploadLogsToCloudWatch(testLogData); 