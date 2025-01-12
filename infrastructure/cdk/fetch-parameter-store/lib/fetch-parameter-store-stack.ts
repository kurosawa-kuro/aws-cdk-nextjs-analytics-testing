import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class FetchParameterStoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // パラメータ参照を作成
    const configParam = ssm.StringParameter.fromStringParameterAttributes(this, 'ConfigParam', {
      parameterName: '/cdkjavascript01'
    });

    // デプロイ時に値を取得するためのカスタムリソースを作成
    const config = new cdk.CustomResource(this, 'ConfigResource', {
      serviceToken: cdk.CustomResourceProvider.getOrCreate(this, 'Custom::SSMParameterReader', {
        codeDirectory: `${__dirname}/lambda`,
        runtime: cdk.CustomResourceProviderRuntime.NODEJS_18_X,
      }),
      properties: {
        ParameterName: configParam.parameterName
      }
    });

    // 出力値を設定
    new cdk.CfnOutput(this, 'AppEnvOutput', {
      value: cdk.Fn.select(0, cdk.Fn.split('"', cdk.Fn.select(1, cdk.Fn.split('"env":"', config.getAttString('Value'))))),
      description: 'Application environment'
    });

    new cdk.CfnOutput(this, 'AppPortOutput', {
      value: cdk.Fn.select(0, cdk.Fn.split('"', cdk.Fn.select(1, cdk.Fn.split('"port":"', config.getAttString('Value'))))),
      description: 'Application port'
    });

    new cdk.CfnOutput(this, 'StorageBucketOutput', {
      value: config.storage.s3Bucket,
      description: 'S3 bucket name for storage'
    });

    new cdk.CfnOutput(this, 'CdnUrlOutput', {
      value: config.storage.cdnUrl,
      description: 'CDN URL for static assets'
    });

    new cdk.CfnOutput(this, 'AwsRegionOutput', {
      value: config.aws.region,
      description: 'AWS region'
    });

    new cdk.CfnOutput(this, 'AwsAccountIdOutput', {
      value: config.aws.accountId,
      description: 'AWS account ID'
    });
  }
}
