(function(runtime, chromeTabs, chromeWindows) {
  const ACTIONS = {
    CREATE: "CREATE",
    REMOVE: "REMOVE",
    UPDATE: "UPDATE",
    TABCREATE: "TABCREATE",
    TABREMOVE: "TABREMOVE",
    TABUPDATE: "TABUPDATE"
  };

  let windowId, tabId;

  const tabOptions = {
    active: true,
    // index: 0,
    // openerTabId
    pinned: true,
    url: "http://www.google.com"
    // windowId: 0,
  };

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
      case ACTIONS.REMOVE:
        removeWindow(sendResponse);
        break;
      case ACTIONS.UPDATE:
        updateWindow(sendResponse);
        break;
      case ACTIONS.TABCREATE:
        createTab(sendResponse);
        break;
    }

    return true;
  }

  function createWindow(sendResponse) {
    chromeWindows.create(windowOptions, window => {
      console.info("createWindow", window.id);
      console.log("window", window);
      console.log("alwaysOnTop", window.alwaysOnTop);
      window.alwaysOnTop = true;
      console.log("alwaysOnTop", window.alwaysOnTop);
      windowId = window.id;
      sendResponse(windowId);
    });
  }

  function removeWindow(sendResponse) {
    const id = windowId;
    chromeWindows.remove(windowId, () => {
      console.info("removeWindow");
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
        console.info("updateWindow", window.id);
        sendResponse(window.id);
      }
    );
  }

  function createTab(sendResponse) {
    chromeTabs.create(tabOptions, tab => {
      console.info("createTab", tab.id);
      console.log("window", tab);
      tabId = tab.id;
      windowId = tab.windowId;

      setTimeout(() => {
        updateWindow(() => {});
        chromeTabs.highlight(
          {
            tabs: tab.index,
            windowId: tab.windowId
          },
          window => {
            console.info("highlight Tab", tabId);
            console.log(window);
          }
        );
      }, 5000);

      sendResponse(tabId);
    });
  }

  function updateTab(sendResponse) {
    chromeTabs.update(
      tabId,
      {
        active: true
        // highlighted: true,
      },
      window => {
        console.info("updateWindow", window.id);
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
