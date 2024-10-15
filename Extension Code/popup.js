// Inject the iframe when the button is clicked
document.getElementById('inject-iframe').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        // Only inject iframe if the URL is not a chrome:// or chrome-extension:// page
        if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content_script.js']
            }, () => {
                console.log('Iframe injected');
            });
        } else {
            console.error('Cannot inject iframe into this page');
            alert('Cannot inject iframe into this page.');
        }
    });
});
