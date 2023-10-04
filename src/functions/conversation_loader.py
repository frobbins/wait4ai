import json
import boto3

def handler(event, context):
    s3 = boto3.client('s3')
    dynamodb = boto3.resource('dynamodb')

    # Get the bucket name and file key from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    # Download the file from S3
    response = s3.get_object(Bucket=bucket, Key=key)
    file_content = response['Body'].read().decode('utf-8')
    conversations = json.loads(file_content)

    # Write to DynamoDB
    table = dynamodb.Table('Conversations')
    for conversation in conversations:
        table.put_item(Item=conversation)

    return {
        'statusCode': 200,
        'body': json.dumps('Conversations loaded successfully!')
    }
