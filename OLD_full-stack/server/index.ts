import express from 'express';
import next from 'next';
import winston from 'winston';
import path from 'path';
import WinstonCloudWatch from 'winston-cloudwatch';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Next.jsアプリの初期化
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

const logGroupName = 'ts-test-01';
const logStreamName = `app-${Date.now()}`;

// Winstonロガーの設定
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // CloudWatch Logs transport - 全環境で有効
    new WinstonCloudWatch({
      logGroupName,
      logStreamName,
      awsRegion: process.env.NEXT_PUBLIC_AWS_REGION,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      messageFormatter: ({ level, message, ...meta }) => {
        return JSON.stringify({
          level,
          message,
          ...meta,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          application: 'ts-test-app'
        });
      }
    }),
    // コンソール出力も全環境で有効化
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

async function startServer() {
  try {
    await nextApp.prepare();
    const app = express();

    // ベーシックなロギング（リクエストボディなし）
    app.use((req, res, next) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const logData = {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          responseTime: Date.now() - startTime,
          userAgent: req.get('user-agent'),
          ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
          timestamp: new Date().toISOString()
        };
        
        if (!req.url.includes('/_next/') && 
            !req.url.includes('/__nextjs_') && 
            !req.url.includes('.svg')) {
          logger.info('HTTP Request', logData);
        }
      });

      next();
    });

    // APIルートのみにボディパーサーを適用
    app.use('/api', express.json());
    app.use('/api', express.urlencoded({ extended: true }));

    // APIルート用の追加ロギング
    app.use('/api', (req, res, next) => {
      if (req.method === 'POST') {
        logger.info('API POST Request', {
          url: req.url,
          body: req.body,
          timestamp: new Date().toISOString()
        });
      }
      next();
    });

    // Next.jsのリクエストハンドラ
    app.all('*', (req, res) => {
      return handle(req, res);
    });

    app.listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();