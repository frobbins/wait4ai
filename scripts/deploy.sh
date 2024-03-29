#!/bin/bash

# Exit on any error
set -e

# Your S3 bucket and CloudFormation stack name
S3_WAIT_BUCKET="wait4ai-bucket"
STACK_NAME="wait4ai"

# Install Python dependencies if any
echo "Installing Python dependencies..."
pip install -r requirements.txt -t lib/python/

# Package the CloudFormation template
echo "Packaging CloudFormation template..."
aws cloudformation --debug package \
    --template-file template.yaml \
    --s3-bucket $S3_WAIT_BUCKET \
    --output-template-file packaged-template.yaml

# Deploy the CloudFormation template
echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file packaged-template.yaml \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_IAM

# Optionally, upload frontend files to the S3 bucket
echo "Uploading frontend files to S3..."
aws s3 sync frontend/ s3://$S3_WAIT_UI_BUCKET/frontend/

echo "Deployment complete."
