import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as child_process from 'child_process';

export class InvokeSlackLamdaSecondStack extends cdk.Stack {
 constructor(scope: Construct, id: string, props?: cdk.StackProps) {
   super(scope, id, props);

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
    this.sendNotification('aaa');
 }

 /**
  * 通知スクリプトを実行する関数
  * @param message 送信するメッセージ
  */
 private sendNotification(message: string): void {
   try {
     const scriptPath = '../../script/send_notification.js';
     const result = child_process.execSync(`node ${scriptPath} "${message}"`);
     console.log("★★★ Script Output ★★★: ", result.toString());
   } catch (error) {
     console.error("★★★ Script Execution Failed ★★★: ", error);
   }
 }
}
