import json
import logging
import boto3
from decimal import Decimal

# Initialize logger and set the log level
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Conversations')

def handler(event, context):
    logger.info(f'Received event...')
    logger.info(f'event: {json.dumps(event)}')

    query_parameters = event.get('queryStringParameters')
    if query_parameters:
        user_input = query_parameters.get('user_input', None)
    else:
        user_input = None


    # Log the extracted user_input
    logger.info(f'User input: {user_input}')

    # Your logic to process the user_input and generate a response
    # For example, you might query the DynamoDB table based on the user_input
    # and generate a response.

    try:
        response = table.query(
            KeyConditionExpression='ConversationID = :convID',
            ExpressionAttributeValues={
                ':convID': 'conv_001'  # Replace with the actual key you want to query
            },
            ScanIndexForward=True  # Sort by SequenceNumber in ascending order
        )
        earliest_sequence = response['Items'][0] if response['Items'] else {}
        thoughts = earliest_sequence.get('Thoughts', [])
    except Exception as e:
        print(f"Error fetching data from DynamoDB: {e}")
        thoughts = []

    response_body = {
        "thoughts": thoughts,
        "follow_up": "Some follow-up action or message"
    }

    # Log the response body
    logger.info(f'Response body: {json.dumps(response_body)}')

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body": json.dumps(response_body, cls=DecimalEncoder)
    }

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

