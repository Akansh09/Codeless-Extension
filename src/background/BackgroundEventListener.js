var url;
var array = [];
tabExecution = undefined;
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {

    chrome.storage.local.get("buttonText", async function (result) {
        if (result.buttonText == "Stop Recording") {
            if (tabId === tab.id && changeInfo.url) {
                url = changeInfo.url
            }
            if (tabId === tab.id && changeInfo.status == 'complete') {
                tabval = tabId;
                chrome.tabs.sendMessage(tab.id, {
                    "message": 'urlChanged',
                    "url": url
                })

                chrome.contextMenus.create({
                    title: 'Assert :: Verify Selected Element Text',
                    contexts: ["all"],
                    id: "elementText",
                    onclick: function (info, tab) {
                        chrome.tabs.sendMessage(tab.id, "getClickedEl", { frameId: info.frameId }, data => {
                            data.value.message.info = info
                            data.value.message.event = "ASSERT_ELEMENT_TEXT"
                            console.log(data.value.message)
                            array.push(data.value.message);
                        });
                    }
                })
                chrome.contextMenus.create({
                    title: 'Assert :: Verify Current Page URL',
                    contexts: ["all"],
                    id: "currentURL",
                    onclick: function (info, tab) {
                        chrome.tabs.sendMessage(tab.id, "getClickedEl", { frameId: info.frameId }, data => {
                            data.value.message.info = info
                            data.value.message.event = "ASSERT_CURRENT_URL"
                            console.log(data.value.message)
                            array.push(data.value.message);
                        });
                    }
                })

                chrome.contextMenus.create({
                    title: 'Assert :: Verify element is Present',
                    contexts: ["all"],
                    id: "elementPresent",
                    onclick: function (info, tab) {
                        chrome.tabs.sendMessage(tab.id, "getClickedEl", { frameId: info.frameId }, data => {
                            data.value.message.info = info
                            data.value.message.event = "ASSERT_ELEMENT_PRESENT"
                            console.log(data.value.message)
                            array.push(data.value.message);
                        });
                    }
                })

                chrome.contextMenus.create({
                    title: 'Assert :: Verify Element is Not Present',
                    contexts: ["all"],
                    id: "elementNotPresent",
                    onclick: function (info, tab) {
                        chrome.tabs.sendMessage(tab.id, "getClickedEl", { frameId: info.frameId }, data => {
                            data.value.message.info = info
                            data.value.message.event = "ASSERT_ELEMENT_NOT_PRESENT"
                            console.log(data.value.message)
                            array.push(data.value.message);
                        });
                    }
                })

                chrome.contextMenus.create({
                    title: 'Assert :: Verify Current Page title',
                    contexts: ["all"],
                    id: "pageTitle",
                    onclick: function (info, tab) {
                        chrome.tabs.sendMessage(tab.id, "getClickedEl", { frameId: info.frameId }, data => {
                            data.value.message.info = info
                            data.value.message.event = "ASSERT_PAGE_TITLE"
                            console.log(data.value.message)
                            array.push(data.value.message);
                        });
                    }
                })

                chrome.tabs.executeScript(tab.id, {
                    file: 'src/injection/EventListenerScript.js'
                })

                chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                    if (request.event == "click" || request.event == "keyup" || request.event == "change" || request.event == "mouseover" || request.event == "urlOpened") {
                        if (array.length == 0) {
                            array.push(request);
                        } else if (JSON.stringify(array[array.length - 1]) != JSON.stringify(request)) {
                            array.push(request);
                        }
                    }

                    if (request.event == "stopRecording") {
                        chrome.contextMenus.removeAll(function (response) {
                            console.log(response);
                        })
                        chrome.storage.local.get("TestCase", async function (result) {
                            if (array.length > 0) {
                                if (!result.hasOwnProperty("TestCase")) {
                                    testCase = { "TestCase": [{ "name": "", "steps": array }] };
                                    chrome.storage.local.set(testCase);
                                    array = [];
                                    url = "";
                                } else {
                                    result.TestCase.push({ "name": "", "steps": array });
                                    chrome.storage.local.set(result);
                                    array = [];
                                    url = "";
                                }
                                chrome.windows.create({ focused: true, state: "maximized", 'url': 'src/popup/recordedSteps.html', 'type': 'popup' }, function (window) {
                                });
                            }
                        })
                    }
                });
            }
        }
    });
});

var index = 0;
var totalTestCases;
var testCaseVal;
var checkedTestCases = [];
var totalSteps = 0;
var stepCount = 1;
var socket;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    checkedTestCases = request.testCaseToBeExecuted;
    if (checkedTestCases && checkedTestCases.length > 0) {
        index = checkedTestCases[0];
        totalTestCases = 0;
        testCaseVal = [];
        totalSteps = 0;
        stepCount = 1;
        console.log(checkedTestCases);
        console.log("Play Button Clicked")
        chrome.storage.local.get("TestCase", function (result) {
            testCaseVal = result.TestCase;
            totalTestCases = result.TestCase.length;
            playTestCase(index);
        })
    }
});

function playTestCase(indexVal) {
    if (totalTestCases <= indexVal) {
        console.log("All Test Cases executed")
        chrome.runtime.sendMessage({ "message": "AllTestCaseDone" });
        socket.emit('end');
        return;
    }
    console.log(indexVal);
    if (checkedTestCases && checkedTestCases.indexOf(indexVal) != -1) {
        if (totalTestCases != 0 && indexVal < totalTestCases) {
            console.log(indexVal + " " + new Date().getTime());
            socket = io.connect('http://localhost:3002', {
                transports: ['websocket'],
                secure: true,
            });
            socket.emit("play", testCaseVal[indexVal]);
            socket.on("assertFailed", function (data) {
                if (data.actual) {
                    console.log(data)
                    chrome.runtime.sendMessage({ "message": "testCaseFailed_" + indexVal })
                    indexVal = indexVal + 1;
                    playTestCase(indexVal);
                }
            })

            socket.on("done", function (data) {
                if (data.action) {
                    console.log("Done")
                    chrome.runtime.sendMessage({ "message": "testCasePassed_" + indexVal })
                    indexVal = indexVal + 1;
                    playTestCase(indexVal);
                }
            })
        }
    } else {
        indexVal = indexVal + 1;
        console.log(indexVal);
        playTestCase(indexVal)
    }
}
          //  if (testCaseVal[indexVal].steps[0].event) {
                // totalSteps = testCaseVal[indexVal].steps.length;
                // socket.emit(testCaseVal[indexVal].steps[0].event, testCaseVal[indexVal].steps[0], async function (responseValue) {
                //     await new Promise(async (resolve, reject) => {
                //         try {
                //             let funSync = async () => {
                //                 await play(socket, testCaseVal[indexVal].steps[stepCount]);
                //                 stepCount++;
                //                 if (stepCount == totalSteps) resolve();
                //                 else funSync();
                //             }
                //             funSync();
                //         } catch (e) {
                //             reject(e);
                //         }
                //     });
                //     if (stepCount == totalSteps) {
                //         await wait(5000, testCaseVal, indexVal, stepCount).then(async (response) => {
                //             chrome.runtime.sendMessage({ "message": "testCasePassed_" + index })
                //             await play(socket, { event: "testCasecomplete" });
                //         });
                //     }
              //  });
           // }
            //  chrome.windows.create({ url: testCaseVal[indexVal].steps[0].url, focused: true, state: "maximized", 'type': 'normal', "incognito": true }, function (window) {
            //  });
            //  chrome.storage.local.set({ "Execution": { "steps": testCaseVal[indexVal].steps, "index": 0 } });
            //  chrome.tabs.onUpdated.addListener(myHandler)
     //   }
  //  } else {
        // chrome.runtime.sendMessage({ "message": "testCaseNot Executed_" + indexVal })
        //index++;
        // playTestCase(index);
  //  }
//}

// function myHandler(tabId, changeInfo, tab) {
//     if (tabId === tab.id && changeInfo.status == 'complete') {
//         chrome.tabs.executeScript(tab.id, {
//             file: '/src/injection/PlayTestCases.js'
//         })
//     }
// }

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.action === 'done') {
//         console.log("passed " + index)
//         chrome.runtime.sendMessage({ "message": "testCasePassed_" + index })
//         index++;
//         playTestCase(index);
//     } else if (request.action === 'error') {
//         console.log("error " + index)
//         console.log(request.error)
//         chrome.runtime.sendMessage({ "message": "testCaseFailed_" + index, "error": request.error })
//         index++;
//         playTestCase(index)
//     }
// });

// function wait(ms) {
//     return new Promise(resolve => {
//         setTimeout(() => {resolve()}, ms)
//     });
// }

// async function play(socket, testCase) {
//     if (testCase.event != "urlOpened") {
//         await socket.emit(testCase.event, testCase, async function (resultVal) {
//             // stepCount = stepCount + 1;
//         });

//         await socket.on("Assert Failed", async function (response) {
//             console.log(response);
//             await chrome.runtime.sendMessage({ "message": "testCaseFailed_" + index })
//             await socket.emit("testCasecomplete", "testCasecomplete");
//             stepCount = totalSteps + 2;
//         })
//     }
// }

