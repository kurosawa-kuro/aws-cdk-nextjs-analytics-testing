import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

// 操作モードの型定義
type OperationMode = 'create' | 'update';

// シークレット設定のインターフェース
interface SecretConfig {
  name: string;
  description: string;
  environment: string;
}

export class SecretsManagerCreateUpdateStack extends cdk.Stack {
  // 操作モードの制御変数
  private readonly mode: OperationMode;
  
  // シークレット設定の制御変数
  private readonly secretConfig: SecretConfig;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 制御変数の初期化
    this.mode = this.node.tryGetContext('mode') || 'create';
    this.secretConfig = {
      name: this.node.tryGetContext('secretName') || '/app/default-secret',
      description: this.mode === 'create' 
        ? 'Newly created secret' 
        : 'Updated secret',
      environment: this.node.tryGetContext('environment') || 'production'
    };

    this.manageSecret();
  }

  private manageSecret(): void {
    if (this.mode === 'update') {
      // 更新モードの場合、既存シークレットを削除
      const existingSecret = secretsmanager.Secret.fromSecretAttributes(this, 'ExistingSecret', {
        secretCompleteArn: `arn:aws:secretsmanager:${this.region}:${this.account}:secret:${this.secretConfig.name}`
      });
      existingSecret.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }

    // 新規シークレットの作成（更新モードでも新規作成）
    new secretsmanager.Secret(this, 'NewSecret', {
      secretName: this.secretConfig.name,
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
  }
}
