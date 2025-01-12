import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const envTemplate = `# AWS Configuration
AWS_ACCOUNT_ID=your-account-id
AWS_REGION=ap-northeast-1

# Application Configuration
ENVIRONMENT=development
SECRET_NAME=your-secret-name

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
`;

function generateEnv() {
  const envPath = join(process.cwd(), '../../.env');
  
  if (existsSync(envPath)) {
    console.error('⚠️ .env file already exists');
    return;
  }

  writeFileSync(envPath, envTemplate);
  console.log('✅ .env file generated successfully');
}

generateEnv(); 