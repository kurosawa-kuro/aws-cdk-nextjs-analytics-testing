import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

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

   console.log("★★★ keyPairName ★★★: ", keyPair.keyName);
   
  //  ターミナルでpwdを実行して、パスを確認する
  console.log("★★★ pwd ★★★: ", process.cwd());

    //  ターミナルでpwdを実行して、パスを確認する
    console.log("★★★ pwd ★★★: ", process.cwd());
 }
}
