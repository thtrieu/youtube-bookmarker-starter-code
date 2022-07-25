chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);

      console.log('Sending from ' + tab.url)
  
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    } else if (tab.url && tab.url.includes("youtube.com")) {
      chrome.tabs.sendMessage(tabId, {
          type: "FEED",
          videoID: ''
      })
    } else if (tab.url && tab.url.includes("reddit.com")) {
      console.log('reddit.com')
      chrome.tabs.sendMessage(tabId, {
          type: "REDDIT",
          videoID: ''
      })
    }
  });
  