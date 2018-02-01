(function(runtime, chromeTabs, chromeWindows) {
  const ACTIONS = {
    CREATE: "CREATE",
    REMOVE: "REMOVE",
    UPDATE: "UPDATE"
  };

  let windowId;

  const windowOptions = {
    focused: true,
    height: 600,
    state: "normal",
    type: "popup",
    url: "http://www.google.com",
    width: 800
  };

  function onMessageExternal(message, sender, sendResponse) {
    console.info("onMessageExternal");
    console.log("message", message);
    console.log("sender", sender);

    switch (message) {
      case ACTIONS.CREATE:
        createWindow(sendResponse);
        break;
      case ACTIONS.UPDATE:
        updateWindow(sendResponse);
        break;
    }
  }

  function createWindow(sendResponse) {
    new Promise(resolve => {
      chromeWindows.create(windowOptions, window => {
        console.info("createWindow", window.id);
        console.log("window", window);
        windowId = window.id;
        resolve(window.id);
      });
    }).then(id => {
      console.log("sendResponse", id);
      sendResponse(id);
    });
  }

  function updateWindow(sendResponse) {
    chromeWindows.update(
      windowId,
      {
        // drawAttention: true,
        focused: true
      },
      window => {
        console.info("updateWindow");
        sendResponse(window.id);
      }
    );
  }

  runtime.onMessageExternal.addListener(onMessageExternal);

  chromeWindows.onCreated.addListener(window => {
    console.info("onCreated", window.id);
  });
  chromeWindows.onRemoved.addListener(id => {
    console.info("onRemoved", id);
  });
  chromeWindows.onFocusChanged.addListener(id => {
    console.info("onFocusChanged", id);
  });
})(chrome.runtime, chrome.tabs, chrome.windows);
