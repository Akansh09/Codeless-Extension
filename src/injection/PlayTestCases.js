var count;
var inputElement;
var indexValue;

(function () { 
    console.log("Starting again");
    start();
})();
async function start() {
    chrome.storage.local.get("Execution", async function (result) {
        response = result.Execution.steps;
        indexValue = result.Execution.index;
        if (response) {
            for (index = indexValue; index < response.length; index++) {
                if (response[index]) {
                    try {
                        await wait(1000, response, index).then((response) => { play(response); })
                        chrome.storage.local.set({ "Execution": { "steps": response, "index": index + 1 } });
                    } catch (e) {
                        chrome.storage.local.set({ "Execution": { "steps": response, "index": response.length } });
                        console.log(e)
                        var msg = { action: 'error', "error": e.message, "errorname": e.name,"failedStep":index};
                        console.log(msg)
                        chrome.runtime.sendMessage(msg);
                        return;
                    }
                }
            }
            if (index != 0 && index == response.length) {
                var msg = { action: 'done' };
                chrome.runtime.sendMessage(msg);
            }
        }
    })
}

function play(testCaseSteps) {
    count = 0;
    click(testCaseSteps);
    type(testCaseSteps);
}

function click(step) {
    if (step && step.event == "click") {
        if (step.id) {
            element = document.getElementById(step.id)
            if (element) {
                element.click();
            } else {
                document.elementFromPoint(step.clientX, step.clientY).click();
            }
        } else if (step.className) {
            length = window.document.getElementsByClassName(step.className).length;
            element = window.document.getElementsByClassName(step.className)[0]
            if (length > 1) {
                element = document.elementFromPoint(step.clientX, step.clientY)
                if (element) {
                    document.elementFromPoint(step.clientX, step.clientY).click();
                }
            } else if (element) {
                element.click();
            } else if (document.querySelector(step.className.replaceAll(" ", ".").length > 0)) {
                document.querySelector(step.className.replaceAll(" ", ".")).click();
            } else if (step.innerText) {
                path = "//" + step.tagName.toLowerCase() + "[text()='" + step.innerText + "']";
                element = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                if (element.singleNodeValue) {
                    element.singleNodeValue.click();
                } else {
                    document.elementFromPoint(step.clientX, step.clientY).click();
                }
            } else {
                document.elementFromPoint(step.clientX, step.clientY).click();
            }
        } else if (step.clientX) {
            element = document.elementFromPoint(step.clientX, step.clientY)
            if (element) {
                document.elementFromPoint(step.clientX, step.clientY).click();
            }
        } else if (step.innerText) {
            path = "//" + step.tagName.toLowerCase() + "[text()='" + step.innerText + "']";
            element = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            if (elememt.singleNodeValue) {
                element.singleNodeValue.click();
            } else {
                document.elementFromPoint(step.clientX, step.clientY).click();
            }
        }
        // if (step.tagName == "INPUT") {
        // focusEvent = new Event("focus", { 'bubbles': true });
        // element.dispatchEvent(focusEvent)
        //     inputElement = element;
        //     element.focus();
        //     element.select();
        // }
    }
}

function type(step) {
    var element;


    if (step && step.event == "keyup") {
        keydown = new KeyboardEvent("keydown", { 'bubbles': true, 'key': step.key });
        keypress = new KeyboardEvent("keypress", { 'bubbles': true, 'key': step.key });
        keyup = new KeyboardEvent("keyup", { 'bubbles': true, 'key': step.key });
        changeEvent = new Event("change", { 'bubbles': true });
        if (step.key != "Shift" && step.key != 'Tab') {
            if (step.placeholder) {
                cssLocator = "input[placeholder='" + step.placeholder + "']";
                element = document.querySelector(cssLocator);
                element.dispatchEvent(keydown)
                element.dispatchEvent(keypress)
                if (step.key == "Backspace") {
                    element.select();
                    element.value = element.value.substring(0, element.value.length - 1);
                } else {
                    if (element.value) {
                        element.focus()
                        element.value = element.value + "" + step.key;
                    } else {
                        element.focus()
                        element.select();
                        element.value = step.key;
                    }
                }
                element.dispatchEvent(keyup)
                element.dispatchEvent(changeEvent);
            } else if (step.id) {
                keydown = new KeyboardEvent("keydown", { 'bubbles': true, 'key': step.key });
                keypress = new KeyboardEvent("keypress", { 'bubbles': true, 'key': step.key });
                keyup = new KeyboardEvent("keyup", { 'bubbles': true, 'key': step.key });
                changeEvent = new Event("change", { 'bubbles': true });
                element = window.document.getElementById(step.id);
                element.dispatchEvent(keydown)
                element.dispatchEvent(keypress)
                if (step.key == "Backspace") {
                    element.select();
                    element.value = element.value.substring(0, element.value.length - 1);
                } else {
                    if (element.value) {
                        element.focus()
                        element.value = element.value.replaceAll(", ", "") + "" + step.key;
                    } else {
                        element.focus()
                        element.select();
                        element.value = step.key;
                    }
                }
                element.dispatchEvent(keyup)
                element.dispatchEvent(changeEvent);
            } else if (step.className) {
                keydown = new KeyboardEvent("keydown", { 'bubbles': true, 'key': step.key });
                keypress = new KeyboardEvent("keypress", { 'bubbles': true, 'key': step.key });
                keyup = new KeyboardEvent("keyup", { 'bubbles': true, 'key': step.key });
                changeEvent = new Event("change", { 'bubbles': true });
                element = window.document.getElementsByClassName(step.className)[0];
                element.dispatchEvent(keydown)
                element.dispatchEvent(keypress)
                if (element.value) {
                    element.focus()
                    element.value = element.value + "" + step.key;
                } else {
                    element.focus()
                    element.select();
                    element.value = step.key;
                }
                element.dispatchEvent(keyup)
                element.dispatchEvent(changeEvent);
            }
        }
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(() => { resolve }, ms));
}


function wait(ms, request, index) {
    return new Promise(resolve => { setTimeout(() => { resolve(request[index]) }, ms) });
}
