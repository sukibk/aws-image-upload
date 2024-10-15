// Function to inject the iframe
function injectIframe() {
    // Remove any existing iframe first to prevent duplicates
    const existingIframe = document.getElementById('upload-iframe');
    if (existingIframe) {
        existingIframe.remove();
    }

    // Create and style the iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'upload-iframe';
    iframe.src = chrome.runtime.getURL('iframe.html');
    iframe.style.position = 'fixed';
    iframe.style.top = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '500px';
    iframe.style.height = '450px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '10px';
    iframe.style.zIndex = '10000';
    iframe.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    document.body.appendChild(iframe);

    // Listen for close message from the iframe
    window.addEventListener('message', (event) => {
        if (event.data === 'closeIframe') {
            const iframeToRemove = document.getElementById('upload-iframe');
            if (iframeToRemove) {
                iframeToRemove.remove();
            }
        }
    });
}

// Inject the iframe when this script is executed
injectIframe();
