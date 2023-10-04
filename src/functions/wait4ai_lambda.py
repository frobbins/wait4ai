import json
import logging

# Initialize logger and set the log level
logger = logging.getLogger()
logger.setLevel(logging.INFO)

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

    response_body = {
        "thoughts": ["Thought 1", "Thought 2", "Thought 3"],
        "follow_up": "Some follow-up action or message"
    }

    # Log the response body
    logger.info(f'Response body: {json.dumps(response_body)}')

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(response_body)
    }
