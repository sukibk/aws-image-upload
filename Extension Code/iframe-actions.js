document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('close-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            window.parent.postMessage('closeIframe', '*');
        });
    } else {
        console.error('Close button not found!');
    }
});
