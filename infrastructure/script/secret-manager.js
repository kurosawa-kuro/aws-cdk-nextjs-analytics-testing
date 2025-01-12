// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
    SecretsManagerClient,
    GetSecretValueCommand,
  } from "@aws-sdk/client-secrets-manager";
  
  const secret_name = process.env.SECRET_NAME || "javascript-app-credentials";
  
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "ap-northeast-1",
  });
  
  let response;
  
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    
    const secret = response.SecretString;
    console.log("Secret retrieved successfully");
    
    // シークレットをJSONとしてパース
    const credentials = JSON.parse(secret);
    
    // ここに実際の処理を記述
    console.log(credentials);

  } catch (error) {
    console.error("Error retrieving secret:", error);
    process.exit(1);
  }
  
  // Your code goes here