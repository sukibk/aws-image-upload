// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Inject content_script.js into the current tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content_script.js']
    });
});
