#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EnvValidatorStack } from '../lib/env-validator-stack';

const app = new cdk.App();
new EnvValidatorStack(app, 'EnvValidatorStack', {
  env: { region: 'ap-northeast-1' },
});