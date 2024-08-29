(function () {
    window.addEventListener("click", function (event) {
        var message = {
            "message": {
                "event": "click",
                "clientX": event.clientX,
                "clientY": event.clientY,
                "ctrlKey": event.ctrlKey,
                "timestamp": event.timeStamp,
                "id": event.target.id,
                "innerText": event.target.innerText,
                "placeholder": event.target.placeholder,
                "classList": event.target.classList.toString(),
                "className": event.target.className,
                "tagName": event.target.tagName,
                "baseURI": event.baseURI,
                "htmlElement": event.toElement.outerHTML,
                "title":event.target.title
            }
        }
        window.postMessage(message, "*");
    }, true);

    window.addEventListener("keypress", function (event) {
        var message = {
            "message": {
                "event": "keyup",
                "key": event.key,
                "clientX": event.target.offsetWidth,
                "shiftKey":event.shiftKey,
                "clientY": event.target.offsetHeight,
                "ctrlKey": event.ctrlKey,
                "timestamp": event.timeStamp,
                "id": event.target.id,
                "name": event.target.name,
                "placeholder": event.target.placeholder,
                "classList": event.target.classList.toString(),
                "className": event.target.className,
                "tagName": event.target.tagName,
                "baseURI": event.baseURI,
                "htmlElement": event.target.outerHTML ? event.target.outerHTML : null
            }
        }
        window.postMessage(message, "*");
    }, true);

    // window.addEventListener("change", function (event) {
    //     var message = {
    //         "message": {
    //             "event": "change",
    //             "checked": event.target.checked,
    //             "clientX": event.clientX,
    //             "clientY": event.clientY,
    //             "timestamp": event.timeStamp,
    //             "id": event.target.id,
    //             "name": event.target.name,
    //             "placeholder": event.target.placeholder,
    //             "classList": event.target.classList.toString(),
    //             "className": event.target.className,
    //             "tagName": event.target.tagName,
    //             "baseURI": event.baseURI,
    //         }
    //     }
    //     window.postMessage(message, "*");
    // }, true);

    window.addEventListener("mouseover", function (event) {
        var message = {
            "message": {
                "event": "mouseover",
                "clientX": event.clientX,
                "clientY": event.clientY,
                "ctrlKey": event.ctrlKey,
                "timestamp": event.timeStamp,
                "id": event.target.id,
                "name": event.target.name,
                "placeholder": event.target.placeholder,
                "classList": event.target.classList.toString(),
                "className": event.target.className,
                "tagName": event.target.tagName,
                "baseURI": event.baseURI,
                "innerText": event.target.innerText,
                "title":event.target.title
            }
        }
        window.postMessage(message, "*");
    }, true);

    var clickedEl = null;
    document.addEventListener("contextmenu", function (event) {
        clickedEl = event;
    }, true);

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request == "getClickedEl") {
            console.log(clickedEl)
            var message = {
                "message": {
                    "event": "contextClick",
                    "clientX": clickedEl.clientX,
                    "clientY": clickedEl.clientY,
                    "ctrlKey": clickedEl.ctrlKey,
                    "timestamp": clickedEl.timeStamp,
                    "id": clickedEl.target.id ? clickedEl.target.id : "",
                    "innerText": clickedEl.target.innerText ? clickedEl.target.innerText : "",
                    "placeholder": clickedEl.target.placeholder ? clickedEl.target.placeholder : "",
                    "classList": clickedEl.target.classList.toString(),
                    "className": clickedEl.target.className ? clickedEl.target.className : "",
                    "tagName": clickedEl.target.tagName ? clickedEl.target.tagName : "",
                    "baseURI": clickedEl.baseURI,
                    "htmlElement": clickedEl.toElement.outerHTML,
                    "pageTitle": document.title
                }
            }
            sendResponse({ "value": message });
        }
    });
})();