S3_WAIT_UI_BUCKET="wait4ai-ui-artifacts-bucket"
aws s3 sync ./frontend/ s3://$S3_WAIT_UI_BUCKET/frontend/