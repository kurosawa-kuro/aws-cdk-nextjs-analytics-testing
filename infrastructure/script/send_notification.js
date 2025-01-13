import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import dotenv from 'dotenv';
import path from 'path';
import { Buffer } from 'buffer';

// 環境変数の読み込み
// dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// エラーメッセージを整形するヘルパー関数
function formatErrorMessage(error) {
    
    return {
        text: "CDK Deployment Error",
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🚨 CDK Deployment Failed",
                    emoji: true
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Error Details:*\n\`\`\`${error}\`\`\``
                }
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `*Time:* ${new Date().toISOString()}`
                    }
                ]
            }
        ]
    };
}

// 環境変数のハードコード（開発用）
const config = {
    AWS_REGION: 'ap-northeast-1',
    AWS_ACCESS_KEY_ID: 'DUMMY_ACCESS_KEY',  // 本番環境では絶対に使用しないでください
    AWS_SECRET_ACCESS_KEY: 'DUMMY_SECRET_KEY',  // 本番環境では絶対に使用しないでください
    LAMBDA_SLACK_NOTIFICATION_FUNCTION: 'slack-notification',
    SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
};

// AWS設定（configオブジェクトを使用）
console.log('AWS Configuration:');
console.log('Region:', config.AWS_REGION);
console.log('Access Key ID:', '****' + config.AWS_ACCESS_KEY_ID.slice(-4));
console.log('Secret Access Key:', '****' + config.AWS_SECRET_ACCESS_KEY.slice(-4));

const client = new LambdaClient({
    region: config.AWS_REGION,
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    }
});

async function invokeLambda(message) {
    const webhookUrl = config.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
        throw new Error('SLACK_WEBHOOK_URL environment variable is not set');
    }

    let payload;
    if (typeof message === 'string') {
        payload = {
            webhookUrl: webhookUrl,
            message: message
        };
    } else {
        payload = {
            webhookUrl: webhookUrl,
            ...message
        };
    }

    const command = new InvokeCommand({
        FunctionName: process.env.LAMBDA_SLACK_NOTIFICATION_FUNCTION || 'slack-notification',
        InvocationType: 'RequestResponse',
        Payload: Buffer.from(JSON.stringify(payload))
    });

    try {
        const response = await client.send(command);
        console.log('Lambda Response:', JSON.parse(Buffer.from(response.Payload)));
        return response;
    } catch (error) {
        console.error('Error invoking Lambda:', error);
        throw error;
    }
}

// コマンドライン引数からメッセージを取得
const message = process.argv[2];
const isError = process.argv[3] === '--error';

if (!message) {
    console.error('使用方法: node send_notification.js <MESSAGE> [--error]');
    process.exit(1);
}

// Lambda関数の呼び出し
const payload = isError ? formatErrorMessage(message) : message;

invokeLambda(payload)
    .then(() => console.log('通知処理が完了しました'))
    .catch(error => {
        console.error('エラーが発生しました:', error);
        process.exit(1);
    });