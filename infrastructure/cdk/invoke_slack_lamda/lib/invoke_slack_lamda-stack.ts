import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as iam from 'aws-cdk-lib/aws-iam';

export class InvokeSlackLamdaStack extends cdk.Stack {
 constructor(scope: Construct, id: string, props?: cdk.StackProps) {
   super(scope, id, props);

   // 既存のSlack通知Lambda
   const slackLambda = lambda.Function.fromFunctionArn(
     this,
     'SlackNotificationLambda',
     'arn:aws:lambda:ap-northeast-1:985539793438:function:slack-notification'
   );

   // デプロイメント通知用SNSトピック
   const deploymentTopic = new sns.Topic(this, 'LamSuccessTopic', {
     displayName: 'Success InvokeSlackLamda'
   });

   // SNSトピックにLambdaをサブスクライブ
   deploymentTopic.addSubscription(
     new subscriptions.LambdaSubscription(slackLambda)
   );

   // CloudFormation成功イベントを監視するルール
   const successRule = new events.Rule(this, 'StackSuccessRule', {
     description: 'Monitor CloudFormation stack success status',
     eventPattern: {
       source: ['aws.cloudformation'],
       detailType: ['CloudFormation Stack Status Change'],
       detail: {
         status: ['CREATE_COMPLETE', 'UPDATE_COMPLETE']
       }
     }
   });

   // EventBridgeルールのターゲットとしてSNSトピックを設定
   successRule.addTarget(
     new targets.SnsTopic(deploymentTopic, {
       message: events.RuleTargetInput.fromObject({
         stackName: events.EventField.fromPath('$.detail.stackName'),
         status: events.EventField.fromPath('$.detail.status'),
         message: 'Success InvokeSlackLamda'
       })
     })
   );

   // EventBridgeにSNSへの発行権限を付与
   deploymentTopic.grantPublish(new iam.ServicePrincipal('events.amazonaws.com'));
 }
}