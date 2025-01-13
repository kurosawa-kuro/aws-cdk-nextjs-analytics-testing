import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';

// 操作モードの型定義
type OperationMode = 'create' | 'delete';

// シークレット設定のインターフェース
interface SecretConfig {
  name: string;
  description: string;
  environment: string;
}

export class SecretsManagerCreateUpdateSecondStack extends cdk.Stack {
  // 操作モードの制御変数
  private readonly mode: OperationMode;
  
  // シークレット設定の制御変数
  private readonly secretConfig: SecretConfig;

  // 固定シークレット名
  private readonly FIXED_SECRET_NAME = 'test-secret-03';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 制御変数の初期化
    this.mode = this.node.tryGetContext('mode') || 'create';
    this.secretConfig = {
      name: this.FIXED_SECRET_NAME,
      description: this.mode === 'create' 
        ? 'Newly created secret' 
        : 'Secret marked for deletion',
      environment: this.node.tryGetContext('environment') || 'production'
    };

    this.manageSecret();
  }

  private manageSecret(): void {
    if (this.mode === 'delete') {
      try {
        // シークレットの存在確認
        const secretExists = this.checkSecretExists(this.FIXED_SECRET_NAME);
        
        if (secretExists) {
          const existingSecret = secretsmanager.Secret.fromSecretNameV2(
            this,
            'ExistingSecret',
            this.FIXED_SECRET_NAME
          );

          // カスタムリソースのIAMロールを作成
          const customResourceRole = new iam.Role(this, 'CustomResourceRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            inlinePolicies: {
              SecretsManagerPolicy: new iam.PolicyDocument({
                statements: [
                  new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                      'secretsmanager:DeleteSecret',
                      'secretsmanager:DescribeSecret',
                      'secretsmanager:GetSecretValue',
                      'secretsmanager:ListSecrets'
                    ],
                    resources: ['*']
                  })
                ]
              })
            }
          });

          // カスタムリソースを使用してシークレットを削除
          new cr.AwsCustomResource(this, 'DeleteSecret', {
            onCreate: {
              service: 'SecretsManager',
              action: 'deleteSecret',
              parameters: {
                SecretId: existingSecret.secretArn,
                ForceDeleteWithoutRecovery: true
              },
              physicalResourceId: cr.PhysicalResourceId.of(existingSecret.secretArn)
            },
            policy: cr.AwsCustomResourcePolicy.fromStatements([
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  'secretsmanager:DeleteSecret',
                  'secretsmanager:DescribeSecret',
                  'secretsmanager:GetSecretValue',
                  'secretsmanager:ListSecrets'
                ],
                resources: ['*']
              })
            ]),
            role: customResourceRole
          });
        }
      } catch (error) {
        console.error('Failed to delete secret:', error);
        throw new Error(`Failed to delete secret: ${this.FIXED_SECRET_NAME}`);
      }
    } else {
      // 新規シークレットの作成（createモード）
      const newSecret = new secretsmanager.Secret(this, 'NewSecret', {
        secretName: this.FIXED_SECRET_NAME,
        description: this.secretConfig.description,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({ 
            environment: this.secretConfig.environment,
            operation: this.mode,
            timestamp: new Date().toISOString()
          }),
          generateStringKey: 'apiKey'
        }
      });

      // ローテーションを無効化
      cdk.Tags.of(newSecret).add('DisableRotation', 'true');
    }
  }

  private checkSecretExists(secretName: string): boolean {
    try {
      const secret = secretsmanager.Secret.fromSecretNameV2(
        this,
        'CheckSecret',
        secretName
      );
      return !!secret.secretArn;
    } catch (error) {
      return false;
    }
  }
}
