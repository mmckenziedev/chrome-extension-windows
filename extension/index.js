(function(runtime, chromeTabs, chromeWindows) {
  runtime.onMessageExternal.addListener(onMessageExternal);

  function onMessageExternal(message, sender, respond) {}
})(chrome.runtime, chrome.tabs, chrome.windows);
