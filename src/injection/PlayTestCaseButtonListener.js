window.document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("playTestCases").addEventListener('click', function () {
        var checkedTestCases = [];
        allElements = document.getElementsByClassName("inputCheckbox");
        for (index = 0; index < allElements.length; index++) {
            if (allElements[index].checked) {
                checkedTestCases.push(parseInt(allElements[index].id.split("_")[1]) - 1)
            }
        }
        if (checkedTestCases.length > 0) {
            chrome.runtime.sendMessage({ "event": "playButtonClicked", "testCaseToBeExecuted": checkedTestCases });
        } else {
            document.getElementsByClassName("heading122")[0].innerText = "* Select Checkboxes!";
            document.getElementsByClassName("heading122")[0].style.color = "red";
        }
    }, false);
});