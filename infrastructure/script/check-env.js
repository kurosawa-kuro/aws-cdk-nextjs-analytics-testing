import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const requiredEnvVars = [
  'AWS_ACCOUNT_ID',
  'AWS_REGION',
  'ENVIRONMENT',
  'SECRET_NAME'
];

function checkEnv() {
  const envPath = join(process.cwd(), '.env');
  
  if (!existsSync(envPath)) {
    console.error('❌ .env file not found');
    process.exit(1);
  }

  const envContent = readFileSync(envPath, 'utf8');
  const missingVars = requiredEnvVars.filter(v => !envContent.includes(v));

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    console.error(missingVars.join('\n'));
    process.exit(1);
  }

  console.log('✅ Environment variables check passed');
}

checkEnv(); 