// after inject the content script,
// then send a message to the content script
function sendMessage(receiverID) {
    chrome.tabs.sendMessage(receiverID, {command: "start"});
}

// inject the content script to the current tab,
// then send a message to the content script
async function mainFun() {
    // get current tab id    
    let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      files: ["/content_scripts/controller.js"],
    },
    sendMessage(currentTab.id)
    );
}

if (window) {
    // run the main function once click
    runController.addEventListener('click', mainFun);
}

