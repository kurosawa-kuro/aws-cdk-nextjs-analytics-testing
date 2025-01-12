#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FetchParameterStoreStack } from '../lib/fetch-parameter-store-stack';

const app = new cdk.App();
new FetchParameterStoreStack(app, 'FetchParameterStoreStack', {
  env: { region: 'ap-northeast-1' },
});