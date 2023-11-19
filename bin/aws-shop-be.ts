#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SpaCdkStack } from '../services/aws-s3-cf-stack';
import { Lambdas } from '../services/aws-shop-be-stack';

class AwsHostingStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);
    //new SpaCdkStack (this, 'AWSRSStack');
    new Lambdas (this, 'Products');
  }
}

const app = new cdk.App();

new AwsHostingStack(app, 'AWSRSStack');

app.synth();