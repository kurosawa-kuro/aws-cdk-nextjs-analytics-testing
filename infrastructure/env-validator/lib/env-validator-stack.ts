import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { execSync } from 'child_process';

// カラーコード定義
const orangeColor = '\x1b[38;5;208m';
const resetColor = '\x1b[0m';

export class EnvValidatorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // スタートメッセージ
    console.log(`${orangeColor}🚀 Stack started!${resetColor}`);

    // Node.jsのバージョンチェック
    const nodeVersion = process.version;
    console.log(`Node.js version: ${nodeVersion}`);

    // pnpmのバージョンチェック
    try {
      const pnpmVersion = execSync('pnpm -v').toString().trim();
      console.log(`pnpm version: ${pnpmVersion}`);
    } catch (error) {
      console.error('pnpm is not installed or not in PATH');
    }

    // Ansibleのバージョンチェック
    try {
      const ansibleVersion = execSync('ansible --version').toString().split('\n')[0];
      console.log(`Ansible version: ${ansibleVersion}`);
    } catch (error) {
      console.error('Ansible is not installed or not in PATH');
    }

    // Dockerのバージョンチェック
    try {
      const dockerVersion = execSync('docker --version').toString().trim();
      console.log(`Docker version: ${dockerVersion}`);
    } catch (error) {
      console.error('Docker is not installed or not in PATH');
    }

    // Docker Composeのバージョンチェック
    try {
      const dockerComposeVersion = execSync('docker-compose --version').toString().trim();
      console.log(`Docker Compose version: ${dockerComposeVersion}`);
    } catch (error) {
      console.error('Docker Compose is not installed or not in PATH');
    }

    // PostgreSQLのバージョンチェック
    try {
      const postgresqlVersion = execSync('psql --version').toString().trim();
      console.log(`PostgreSQL version: ${postgresqlVersion}`);

      // postgresユーザーでデータベース情報を取得
      try {
        const dbInfo = execSync('sudo -u postgres psql -l').toString();
        console.log('📊 Available Databases:');
        console.log(dbInfo);

        // 各データベースのテーブル情報を表示
        const databases = dbInfo.split('\n')
          .filter(line => {
            // 有効なデータベース行のみを抽出
            const parts = line.split('|');
            return parts.length > 1 && 
                   !line.startsWith('-') && 
                   !line.startsWith(' ') && 
                   line.trim() !== '';
          })
          .map(line => {
            // 最初のカラム（データベース名）を取得
            const dbName = line.split('|')[0].trim();
            return dbName;
          })
          .filter(db => db && !['Name', 'template0', 'template1', 'postgres'].includes(db));

        for (const db of databases) {
          try {
            console.log(`\n📁 Database: ${db}`);
            const tables = execSync(`sudo -u postgres psql -d ${db} -c "\\dt"`).toString();
            
            if (tables.includes('Did not find any relations')) {
              console.log('  No tables found');
            } else {
              const tableLines = tables.split('\n')
                .filter(line => line.trim() && !line.startsWith(' ') && !line.includes('List of relations'))
                .map(line => `  ${line.trim()}`);
              
              console.log(tableLines.join('\n'));
            }
          } catch (error) {
            const dbError = error as Error;
            console.error(`  Failed to retrieve tables: ${dbError.message}`);
          }
        }
      } catch (error) {
        const dbError = error as Error;
        console.error('Failed to retrieve database information:', dbError.message);
      }
    } catch (error) {
      console.error('PostgreSQL is not installed or not in PATH');
    }
  }
}
