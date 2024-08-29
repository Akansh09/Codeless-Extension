document.addEventListener('DOMContentLoaded', function () {
     chrome.storage.local.get("buttonText", function (result) {
          if (result.buttonText != null && result.buttonText != undefined) {
               document.getElementById("recordSteps").innerText = result.buttonText;
          }
     })
     document.getElementById("recordSteps").addEventListener("click", function () {
          if (document.readyState == "complete") {
               if (document.getElementById("recordSteps").innerText == "Record") {
                    chrome.storage.local.get("buttonText", function (result) {
                         if (result.buttonText == null || result.buttonText == "Record") {
                              document.getElementById("recordSteps").innerText = "Stop Recording";
                              chrome.storage.local.set({ buttonText: "Stop Recording" });
                           //   window.open("")
                           chrome.windows.create({focused: true, state: "maximized", 'type': 'normal',"incognito": true }, function (window) {
        });
                         }
                    });
               } else {
                    chrome.storage.local.get("buttonText", function (result) {
                         if (result.buttonText == "Stop Recording") {
                              document.getElementById("recordSteps").innerText = "Record";
                              chrome.storage.local.set({ buttonText: null });
                              chrome.runtime.sendMessage({ "event": "stopRecording" });
                         }
                    });
               }

          }
     });
});

document.addEventListener('DOMContentLoaded', function () {
     document.getElementById("viewRecords").addEventListener("click", function () {
          chrome.windows.create({focused: true,state:"maximized",'url': 'src/popup/recordedSteps.html', 'type': 'popup'}, function(window) {
          });
     });
});

chrome.runtime.onMessage.addListener(
     function (request, sender, sendResponse) {
          chrome.storage.local.get("buttonText", function (result) {
               if (result.buttonText == "Stop Recording") {
                    if (request.message === 'urlChanged') {
                         requestVal = { "event": "urlOpened", "url": request.url };
                         chrome.runtime.sendMessage(requestVal);
                    }
               } else {
               }
          })
     }
);

window.addEventListener("message", (event) => {
     chrome.storage.local.get("buttonText", function (result) {
          if (result.buttonText == "Stop Recording") {
               if (event.source != window) {
                    return;
               }
               if (event.data.message) {
                    chrome.runtime.sendMessage(event.data.message);
               }
          } else {
          }
     })
});
