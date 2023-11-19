import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
// import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class Lambdas extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productBucket = new s3.Bucket(this, 'Product');
    const productListBucket = new s3.Bucket(this, 'ProductsList');

    // Создание Lambda функции для обработки продукта
    const productLambda = new lambda.Function(this, 'product', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lamb/product'), 
      environment: {
        BUCKET: productBucket.bucketName
      }
    });

    productBucket.grantReadWrite(productLambda);

    // Создание Lambda функции для списка продуктов
    const productListLambda = new lambda.Function(this, 'productList', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lamb/productList'), 
      environment: {
        BUCKET: productListBucket.bucketName
      }
    });

    productListBucket.grantReadWrite(productListLambda);

    // Создание API Gateway
    const api = new apigateway.RestApi(this, 'ProductAPI', {
      restApiName: 'products',
      description: 'Service for shop app RSSchool',
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type'],
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    // Создание ресурса API для списка продуктов
    const productListResource = api.root.addResource('products');
    productListResource.addMethod('GET', new apigateway.LambdaIntegration(productListLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200 }' },
    }));

    // Создание ресурса API для продукта
    const productResource = productListResource.addResource('{productId}');
    productResource.addMethod('GET', new apigateway.LambdaIntegration(productLambda));

    // Вывод URL API
    new cdk.CfnOutput(this, 'apiUrl', {
      value: api.url!,});
  }
}

const app = new cdk.App();
new Lambdas(app, 'Products');
