(function(runtime, notifications, tabs, chromeWindows) {
  const ACTIONS = {
    CREATE: "CREATE",
    REMOVE: "REMOVE",
    UPDATE: "UPDATE",
    NOTIFICATION_CREATE: "NOTIFICATION_CREATE",
    TABCREATE: "TABCREATE",
    TABREMOVE: "TABREMOVE",
    TABUPDATE: "TABUPDATE",
    GET_TAB: "GET_TAB"
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
      case ACTIONS.TABUPDATE:
        updateTab(sendResponse);
        break;
      case ACTIONS.NOTIFICATION_CREATE:
        basicNotification(sendResponse);
        break;
      case ACTIONS.GET_TAB:
        getCurrentTab(sendResponse);
        break;
    }

    return true;
  }

  function createWindow(sendResponse) {
    chromeWindows.create(windowOptions, window => {
      console.group("createWindow", window.id);
      console.log("window", window);
      windowId = window.id;
      sendResponse(windowId);
      console.groupEnd();
    });
  }

  function removeWindow(sendResponse) {
    const id = windowId;
    chromeWindows.remove(windowId, () => {
      console.group("removeWindow");
      console.log("window id", id);
      sendResponse(id);
      console.groupEnd();
    });
  }

  function updateWindow(sendResponse = () => {}) {
    chromeWindows.update(
      windowId,
      {
        // drawAttention: true,
        focused: true
      },
      window => {
        const { id } = window;
        console.group("updateWindow", id);
        console.log("window id", id);
        sendResponse(id);
        console.groupEnd();
      }
    );
  }

  function createTab(sendResponse) {
    tabs.create(tabOptions, tab => {
      console.group("createTab", tab.id);
      console.log("tab", tab);
      tabId = tab.id;
      windowId = tab.windowId;
      sendResponse(tabId);
      console.groupEnd();
    });
  }

  function updateTab(sendResponse) {
    tabs.update(
      tabId,
      {
        active: true
      },
      window => {
        console.group("updateTab", tabId);
        updateWindow();
        /* 
        setTimeout(() => {
          updateWindow();
          tabs.highlight(
            {
              tabs: tab.index,
              windowId: tab.windowId
            },
            window => {
              console.info("highlight Tab", tabId);
              console.log(window);
              sendResponse(window.id);
            }
          );
        }, 5000);
 */
        sendResponse(window.id);
        console.groupEnd();
      }
    );
  }

  function basicNotification(sendResponse) {
    chrome.notifications.create(
      undefined,
      {
        buttons: [
          {
            title: "BUTTON_1"
          },
          {
            title: "BUTTON_2"
          }
        ],
        contextMessage: "CONTEXTMESSAGE",
        isClickable: true,
        message: "BASIC NOTIFICATION CONTENT",
        iconUrl: "icon.png",
        requireInteraction: true,
        title: "BASIC NOTIFICATION TITLE",
        type: "basic"
      },
      notificationId => {
        console.group("basicNotification");
        console.log("notificationId", notificationId);
        sendResponse(notificationId);
        console.groupEnd();
      }
    );
  }

  function getCurrentTab(sendResponse) {
    tabs.query(
      {
        // active: true,
        windowType: "normal",
        // currentWindow: true
      },
      d => {
        console.group("getCurrentTab");
        console.log(d);
        console.groupEnd();
        sendResponse(d);
      }
    );
  }

  runtime.onMessageExternal.addListener(onMessageExternal);

  chromeWindows.onCreated.addListener(window => {
    console.info("chrome.windows.onCreated", window.id);
  });
  chromeWindows.onRemoved.addListener(id => {
    console.info("chrome.windows.onRemoved", id);
  });
  chromeWindows.onFocusChanged.addListener(id => {
    console.info("chrome.windows.onFocusChanged", id);
  });

  notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    console.group("notification onButtonClicked");
    console.log("buttonIndex", buttonIndex);
    console.log("notificationId", notificationId);
    console.groupEnd();
  });

  tabs.onCreated.addListener(tab => {
    console.info("chrome.tabs.onCreated", tab);
  });

  tabs.onUpdated.addListener((tabId, changeInfo) => {
    console.info(
      "chrome.tabs.onUpdated",
      "tabId:",
      tabId,
      "changeInfo:",
      changeInfo
    );
  });

  tabs.onActivated.addListener(activeInfo => {
    console.info("chrome.tabs.onActivated", "activeInfo:", activeInfo);
  });
})(chrome.runtime, chrome.notifications, chrome.tabs, chrome.windows);
