const EXTENSION_ID = "dpeojpbaididkeplbcbkchbaljcpbkob";

const ACTIONS = {
  CREATE: "CREATE",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE"
};

const openPopupWindow = document.querySelector("#openPopupWindow");
openPopupWindow.addEventListener("click", () => {
  openWindow();
});

const updatePopupWindow = document.querySelector("#updatePopupWindow");
updatePopupWindow.addEventListener("click", () => {
    updateWindow();
});

const removePopupWindow = document.querySelector("#removePopupWindow");
removePopupWindow.addEventListener("click", () => {
    removeWindow();
});

function sendExtensionRequest(request) {
  window.chrome.runtime.sendMessage(EXTENSION_ID, request, response => {
    console.log("sendMessage response", response);

    if (!response) {
      console.error("sendMessage error", window.chrome.runtime.lastError);
    }
  });
}

function openWindow() {
  sendExtensionRequest(ACTIONS.CREATE);
}

function updateWindow() {
  sendExtensionRequest(ACTIONS.UPDATE);
}

function removeWindow() {
  sendExtensionRequest(ACTIONS.REMOVE);
}
