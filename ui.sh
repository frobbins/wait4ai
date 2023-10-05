S3_WAIT_UI_BUCKET="wait4ai-ui-artifacts-bucket"

# Optionally, upload frontend files to the S3 bucket
echo "Uploading frontend files to S3..."
aws s3 sync frontend/ s3://$S3_WAIT_UI_BUCKET/frontend/
echo "Successfully uploaded frontend files to S3."