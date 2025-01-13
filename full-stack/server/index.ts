import express from 'express';
import next from 'next';
import morgan from 'morgan';
import winston from 'winston';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Next.jsアプリの初期化
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

// Winstonロガーの設定
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log')
    })
  ]
});

// 開発環境ではコンソールにも出力
if (dev) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

async function startServer() {
  try {
    await nextApp.prepare();
    const app = express();

    // ログミドルウェアの設定
    app.use(morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim())
      }
    }));

    // アクセスログ
    app.use((req, res, next) => {
      const startTime = Date.now();
      
      // レスポンスヘッダーにキャッシュ制御を追加
      res.setHeader('Cache-Control', 'no-store');
      
      res.on('finish', () => {
        const logData = {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          responseTime: Date.now() - startTime,
          userAgent: req.get('user-agent'),
          ip: req.ip,
          timestamp: new Date().toISOString()
        };
        
        // 開発用アセットへのリクエストはログ出力を省略
        if (!req.url.includes('/_next/') && !req.url.includes('/__nextjs_')) {
          logger.info('Access Log', logData);
        }
      });

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