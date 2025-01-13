import * as child_process from 'child_process';

/**
 * 通知スクリプトを実行する関数
 * @param message 送信するメッセージ
 */
export function sendNotification(message: string): void {
  try {
    const scriptPath = '../../script/send_notification.js';
    const result = child_process.execSync(`node ${scriptPath} "${message}"`);
    console.log("★★★ Script Output ★★★: ", result.toString());
  } catch (error) {
    console.error("★★★ Script Execution Failed ★★★: ", error);
  }
} 