# AWS Image Upload Chrome Extension

![Alt text](https://raw.githubusercontent.com/sukibk/aws-image-upload/master/app_ss.png)


## Overview

This repository contains a Chrome extension designed for **uploading images resized to a proper width** for **AUVSI's USRD purposes**. Images are converted to **JPG format** and uploaded to our **FTP server**. The extension integrates with AWS services to handle the resizing and storing of the images in **S3 buckets**, while also ensuring **data redundancy** by keeping the images stored on both **FTP servers** and **the cloud**.

### Subfolders

1. **AWS Code**
   - Contains the code for AWS Lambda functions used for image processing and uploading.
   
2. **Extension Code**
   - Contains the Chrome extension setup and code that interacts with AWS and the FTP server.

### Key Features

- **Image Resizing**: Automatically resizes uploaded images to the required dimensions for AUVSI USRD purposes.
- **JPG Conversion**: Converts images to JPG format for compatibility.
- **AWS S3 Integration**: Utilizes AWS S3 buckets for image storage. Events triggered by S3 ensure that once an image is uploaded, it is processed by AWS Lambda.
- **FTP Server**: Stores images on our FTP server, in addition to the cloud, for **enhanced data redundancy** and **easy retrieval**.

### Cloud & FTP Synchronization

- The app ensures **data redundancy** by storing images in both **AWS S3** and our **FTP server**.
- This approach guarantees that images are safe and can be retrieved from either platform as needed.

### Usage Instructions

1. **Install the Chrome Extension**:
   - Download and install the extension from the Chrome Web Store or load it manually from the `Extension Code` folder.

2. **Upload Images**:
   - The extension allows users to upload images, which will be resized and converted before being stored.

3. **Storage & Uploading**:
   - Uploaded images are stored in both AWS S3 and FTP servers.
   - AWS Lambda functions handle the resizing, conversion, and synchronization with the FTP server.

4. **Authentication**:
   - Currently, **authentication and authorization** features are not implemented. Users can upload images without logging in at this stage.

### Requirements

- Chrome browser with extension support.
- AWS credentials for setting up S3 buckets and Lambda functions (provided in `AWS Code`).

---

### Future Improvements

- **Authentication & Authorization**: Upcoming features will include secure user login and role-based permissions.
- **Advanced Image Processing**: More control over image formats and resolutions.

### Contributing

Feel free to submit pull requests for bug fixes or additional features!
