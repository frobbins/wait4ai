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
    if query_parameters is not None:
        sequence = Decimal(query_parameters.get('sequence', 1))
    else:
        sequence = Decimal(1)  # Default value

    logger.info(f'sequence: {sequence}')

    try:
        response = table.query(
            KeyConditionExpression='ConversationID = :convID AND SequenceNumber = :seq',
            ExpressionAttributeValues={
                ':convID': 'conv_001',
                ':seq': sequence  # Use the sequence number
            }
        )
        earliest_sequence = response['Items'][0] if response['Items'] else {}
        thought = earliest_sequence.get('thought', '')
        thought_image = earliest_sequence.get('thought_image', '')
        ai = earliest_sequence.get('ai', '')
        ai_image = earliest_sequence.get('ai_image', '')

    except Exception as e:
        logger.error(f"Error fetching data from DynamoDB: {e}")
        thought = ''
        thought_image = ''
        ai = ''
        ai_image = ''

    response_body = {
        "thought": thought,
        "thought_image": thought_image
        "ai": ai,
        "ai_image": ai_image,
        "sequence": str(sequence)
    }

    logger.info(f'Response body: {json.dumps(response_body)}')

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body": json.dumps(response_body)
    }

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

