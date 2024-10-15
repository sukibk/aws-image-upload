import boto3
from ftplib import FTP
from io import BytesIO
import os

# Initialize S3 client
s3 = boto3.client('s3')

# FTP credentials
FTP_HOST = 'FTP host goes here'
FTP_USER = 'FTP username goes here'
FTP_PASS = 'FTP password goes here'

def upload_to_ftp(filename, image_data):
    """Upload a file to the FTP server."""
    try:
        ftp = FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)

        # Convert image data to BytesIO object if it's not already
        if not isinstance(image_data, BytesIO):
            image_data = BytesIO(image_data)

        # Upload the file to the FTP server
        ftp.storbinary(f"STOR {filename}", image_data)
        ftp.quit()
        print(f"File {filename} uploaded successfully to FTP server.")
    except Exception as e:
        print(f"FTP upload failed: {e}")
        raise e

def lambda_handler(event, context):
    try:
        # Get bucket and object key from S3 event
        for record in event['Records']:
            bucket = record['s3']['bucket']['name']
            key = record['s3']['object']['key']

            # Get the object (image) from the S3 bucket
            response = s3.get_object(Bucket=bucket, Key=key)
            image_data = response['Body'].read()

            # Upload the image to the FTP server
            upload_to_ftp(key, image_data)

        return {
            'statusCode': 200,
            'body': 'FTP upload successful'
        }

    except Exception as e:
        print(f"Error occurred: {e}")
        return {
            'statusCode': 500,
            'body': f"Error processing file upload: {e}"
        }
