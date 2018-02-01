const EXTENSION_ID = "dfnefbidflapeabbooknciagdbfjmoil";

const openPopupWindow = document.querySelector("#openPopupWindow");
openPopupWindow.addEventListener("click", () => {
  alert("!");
});

function sendExtensionRequest(request) {
  window.chrome.runtime.sendMessage(EXTENSION_ID, request, response => {
    console.log("sendMessage response", response);

    if (!response) {
      console.error("sendMessage error", window.chrome.runtime.lastError);
    }
  });
}
