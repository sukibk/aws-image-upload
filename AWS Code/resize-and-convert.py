import json
import base64
import boto3
import logging

s3 = boto3.client('s3')

# Define your S3 bucket names
UNRESIZED_BUCKET = 'Bucket name goes here'

def lambda_handler(event, context):
logging.basicConfig(level=logging.INFO)
try:
# Log the incoming event
logging.info(f"Incoming event: {event}")

# Parse the incoming event
if 'body' not in event:
raise ValueError("Request body is missing")

body = json.loads(event['body'])
base64_image = body['image']
original_filename = body['filename']

# Decode the base64-encoded image
image_data = base64.b64decode(base64_image)

# Upload the original image to the S3 bucket
s3.put_object(
    Bucket=UNRESIZED_BUCKET,
    Key=original_filename,
    Body=image_data,
    ContentType='image/jpeg'  # Adjust content type based on the format
)

# Return success with CORS headers
return {
    'statusCode': 200,
    'headers': {
        'Access-Control-Allow-Origin': '*',  # Allow any origin (or restrict to specific origin)
'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',  # Allowed methods
'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Allowed headers
},
'body': json.dumps('Image uploaded successfully')
}

except Exception as e:
    logging.error(f"Error processing image: {str(e)}")
return {
    'statusCode': 500,
    'headers': {
        'Access-Control-Allow-Origin': '*',  # CORS headers for error response too
'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
},
'body': json.dumps(f"Error processing image: {str(e)}")
}
