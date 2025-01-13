#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InvokeSlackLamdaSecondStack } from '../lib/invoke_slack_lamda_second-stack';

const app = new cdk.App();
new InvokeSlackLamdaSecondStack(app, 'InvokeSlackLamdaSecondStack', {
  env: { region: 'ap-northeast-1' },
});