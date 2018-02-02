const EXTENSION_ID = "dpeojpbaididkeplbcbkchbaljcpbkob";

const ACTIONS = {
  CREATE: "CREATE",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE",
  NOTIFICATION_CREATE: "NOTIFICATION_CREATE",
  TABCREATE: "TABCREATE",
  TABREMOVE: "TABREMOVE",
  TABUPDATE: "TABUPDATE"
};

const openPopupWindow = document.querySelector("#openPopupWindow");
openPopupWindow.addEventListener("click", () => {
  sendExtensionRequest(ACTIONS.CREATE);
  // window.setTimeout(updateWindow, 5000);
});

const updatePopupWindow = document.querySelector("#updatePopupWindow");
updatePopupWindow.addEventListener("click", () => {
  sendExtensionRequest(ACTIONS.UPDATE);
});

const removePopupWindow = document.querySelector("#removePopupWindow");
removePopupWindow.addEventListener("click", () => {
  sendExtensionRequest(ACTIONS.REMOVE);
});

const openTab = document.querySelector("#openTab");
openTab.addEventListener("click", () => {
  sendExtensionRequest(ACTIONS.TABCREATE);
  // window.setTimeout(() => {
  //   sendExtensionRequest(ACTIONS.TABUPDATE);
  // }, 5000);
});

const updateTab = document.querySelector("#updateTab");
updateTab.addEventListener("click", () => {
  sendExtensionRequest(ACTIONS.TABUPDATE);
});

const createNote = document.querySelector("#createNote");
createNote.addEventListener("click", () => {
  sendExtensionRequest(ACTIONS.NOTIFICATION_CREATE);
});

function sendExtensionRequest(request) {
  window.chrome.runtime.sendMessage(EXTENSION_ID, request, response => {
    console.log("sendMessage response", response);

    if (!response) {
      console.error("sendMessage error", window.chrome.runtime.lastError);
    }
  });
}
