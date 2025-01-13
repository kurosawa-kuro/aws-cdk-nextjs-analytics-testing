#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InvokeSlackLamdaStack } from '../lib/invoke_slack_lamda-stack';

const app = new cdk.App();
new InvokeSlackLamdaStack(app, 'InvokeSlackLamdaStack', {
  env: { region: 'ap-northeast-1' },
});