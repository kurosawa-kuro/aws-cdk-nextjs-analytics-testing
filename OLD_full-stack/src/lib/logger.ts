// カラー付きログ出力用ユーティリティ

// ログレベルと対応する色を定義
const logLevels = {
  info: '\x1b[32m', // 緑色
  error: '\x1b[31m', // 赤色
  warn: '\x1b[33m', // 黄色
  debug: '\x1b[34m', // 青色
  processStart: '\x1b[38;5;208m', // オレンジ
  processEnd: '\x1b[36m' // シアン
};

// 指定されたログレベルでメッセージを出力
export function logWithColor(message: string, level: keyof typeof logLevels) {
  console.log(`${logLevels[level]}${message}\x1b[0m`);
}

// 使用例
// logWithColor('Application started', 'processStart'); 