import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class BasicStack extends cdk.Stack {
  // 通知用スクリプトのパスを定数化
  private static readonly NOTIFICATION_SCRIPT_PATH = '../../script/send_notification.js';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    try {
      console.log('\x1b[38;5;208m★ ★ ★ start ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★\x1b[0m');  

      // タイムスタンプ付きキーペア作成
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const keyPairName = `slack-lambda-keypair-${timestamp}`;
      
      const keyPair = new ec2.CfnKeyPair(this, 'SlackLambdaKeyPair', {
        keyName: keyPairName,
        keyType: 'rsa',
        tags: [{
          key: 'CreatedBy',
          value: 'CDK'
        }]
      });

      // キーペア名を出力
      new cdk.CfnOutput(this, 'KeyPairName', {
        value: keyPair.keyName,
        description: 'Name of the created key pair'
      });

      // スクリプト実行関数を呼び出し
      this.executeNotificationScript('CDK Stack initialized successfully');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      this.executeNotificationScript(`CDK Stack Error: ${message}`);
      throw error;
    }
  }

  /**
   * 通知スクリプトを実行するメソッド
   * @param message 送信するメッセージ
   */
  private executeNotificationScript(message: string): void {
    try {
      const result = require('child_process').execSync(
        `node ${BasicStack.NOTIFICATION_SCRIPT_PATH} "${message}"`
      );
    } catch (error) {
      console.error("★★★ Script Execution Failed ★★★: ", error);
      // スクリプト実行失敗時もコンソールに出力
      throw error;
    }
  }
}
