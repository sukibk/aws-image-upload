// Event listener for "Select Image" button
document.getElementById('select-image-btn').addEventListener('click', function () {
    // Trigger the hidden file input
    document.getElementById('file-input').click();
});

// Event listener for file input
document.getElementById('file-input').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (file) {
        // Enable the Upload button and remove the disabled class
        const uploadBtn = document.getElementById('upload-btn');
        uploadBtn.disabled = false;
        uploadBtn.classList.remove('disabled');

        // Remove placeholder text
        const placeholderText = document.getElementById('placeholder-text');
        if (placeholderText) placeholderText.remove();

        // Remove grey border by adding the class "image-selected"
        const previewContainer = document.getElementById('preview-container');
        previewContainer.classList.add('image-selected'); // Add class to remove the grey border

        // Read the file as a base64 string
        const reader = new FileReader();
        reader.onload = async function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = async function () {
                const canvas = document.createElement('canvas');
                const maxWidth = 400;
                const maxHeight = 300;
                let width = img.width;
                let height = img.height;

                // Resize keeping aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const widthRatio = maxWidth / width;
                    const heightRatio = maxHeight / height;
                    const ratio = Math.min(widthRatio, heightRatio);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                // Resize the image on canvas
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Clear previous preview and display the resized image
                previewContainer.innerHTML = ''; // Clear the container
                const imgPreview = document.createElement('img');
                imgPreview.src = canvas.toDataURL('image/jpeg');
                previewContainer.appendChild(imgPreview);
            };
        };

        reader.readAsDataURL(file);  // Read the file as base64 for preview and resizing
    }
});

document.getElementById('upload-btn').addEventListener('click', async function () {
    const file = document.getElementById('file-input').files[0];
    if (file) {
        // Hide the UI elements (except logo and close button)
        const elementsToHide = document.querySelectorAll('.image-preview, #select-image-btn, #upload-btn');
        elementsToHide.forEach(el => el.classList.add('fade-out'));

        // Show the spinner
        document.getElementById('spinner').classList.remove('hidden');

        // Resize and prepare the image for upload
        const reader = new FileReader();
        reader.onload = async function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = async function () {
                const canvas = document.createElement('canvas');
                const maxWidth = 400;
                const maxHeight = 300;
                let width = img.width;
                let height = img.height;

                // Resize keeping aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const widthRatio = maxWidth / width;
                    const heightRatio = maxHeight / height;
                    const ratio = Math.min(widthRatio, heightRatio);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                // Resize the image on canvas
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert the image to Blob format (JPEG)
                const resizedImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

                // Convert Blob to Base64 string
                const base64Image = await blobToBase64(resizedImageBlob);

                // Prepare to send to Amazon API
                const fileName = file.name.split('.').slice(0, -1).join('.') + ".jpg";
                const apiUrl = "URL to AWS Rest API"; // Replace with your API endpoint

                try {
                    const response = await fetch(apiUrl, {
                        method: "PUT", // Use PUT method for the REST API
                        body: JSON.stringify({
                            image: base64Image.split(',')[1],  // Send only the Base64 part
                            filename: fileName
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const result = await response.json();

                    // Hide spinner and show success message
                    document.getElementById('spinner').classList.add('hidden');
                    const messageContainer = document.getElementById('message-container');
                    messageContainer.classList.remove('hidden');
                    messageContainer.classList.add('success');
                    messageContainer.innerHTML = `
                        <div class="success-message">Image uploaded successfully!</div>
                        <button id="upload-another-btn" class="styled-btn">Upload Another Image</button>
                    `;

                    // Center the message in the middle
                    messageContainer.style.display = "flex";
                    messageContainer.style.flexDirection = "column";
                    messageContainer.style.justifyContent = "center";
                    messageContainer.style.alignItems = "center";

                    // Reset to upload another image
                    document.getElementById('upload-another-btn').addEventListener('click', () => {
                        resetUI();
                    });

                } catch (error) {
                    console.error('Error uploading the image:', error);

                    // Hide spinner and show error message
                    document.getElementById('spinner').classList.add('hidden');
                    const messageContainer = document.getElementById('message-container');
                    messageContainer.classList.remove('hidden');
                    messageContainer.classList.add('error');
                    messageContainer.innerHTML = `
                        <div class="error-message">Error uploading the image: ${error.message}</div>
                    `;
                }
            };
        };

        reader.readAsDataURL(file);  // Read the file as base64 for preview and resizing
    }
});

// Utility function to convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);  // Convert Blob to base64
    });
}

function resetUI() {
    // Hide the message container
    const messageContainer = document.getElementById('message-container');
    messageContainer.classList.add('hidden');
    messageContainer.innerHTML = ''; // Clear the message container's contents

    // Reset the upload button and preview container
    document.getElementById('upload-btn').disabled = true;
    document.getElementById('upload-btn').classList.add('disabled');
    document.getElementById('preview-container').innerHTML = '<p id="placeholder-text">No image selected</p>';
    document.getElementById('preview-container').classList.remove('image-selected'); // Remove the image-selected class

    // Reset file input and make sure to show the UI elements again
    document.getElementById('file-input').value = ""; // Clear the file input
    document.querySelectorAll('.image-preview, #select-image-btn, #upload-btn').forEach(el => {
        el.classList.remove('fade-out');  // Show elements again
        el.classList.remove('hidden');    // Ensure they are visible
    });
}
