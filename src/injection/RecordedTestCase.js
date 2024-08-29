var data = []
function clickTestCase(event) {
  if (event.currentTarget.data) {
    id = event.currentTarget.data
  } else {
    id = event.currentTarget.id;
  }
  hiddenTestCaseId = document.createElement("input");
  hiddenTestCaseId.hidden = true;
  hiddenTestCaseId.id = "testCaseId";
  hiddenTestCaseId.value = event.currentTarget.id;
  response = event.currentTarget.response;
  document.getElementsByClassName("container")[0].style.display = 'none';
  maindivision = document.createElement("div");
  maindivision.style.margin = "56px";
  var steps = 1;
  table = document.createElement("table");
  table.class = "table";
  thead = document.createElement("thead");
  tableHeadRow = document.createElement("tr");
  tableHeadingElement = document.createElement("th");
  tableHeadingElement.innerHTML = "Element";
  tableHeadingInputPassed = document.createElement("th");
  tableHeadingInputPassed.innerHTML = "Value";
  tableHeadingStepDone = document.createElement("th");
  tableHeadingStepDone.innerHTML = "Steps";
  tableHeading4 = document.createElement("th");
  tableHeading4.innerHTML = "";
  tableHeadRow.appendChild(tableHeadingStepDone)
  tableHeadRow.appendChild(tableHeadingElement)
  tableHeadRow.appendChild(tableHeadingInputPassed)
  tableHeadRow.appendChild(tableHeading4)
  thead.appendChild(tableHeadRow);
  table.appendChild(thead);
  tableBody = document.createElement("tbody");
  division = document.createElement("div");
  for (i = 0; i < response.length; i++) {
    //table = undefined;
    editIcon = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"'
      + ' width="30" height="30"'
      + 'viewBox="0 0 172 172"'
      + 'style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="original-icon" fill="#2ecc71"><path d="M130.88125,17.2c-2.93403,0 -5.86843,1.12051 -8.10729,3.35938l-13.84062,13.84063l28.66667,28.66667l13.84062,-13.84063c4.47773,-4.47773 4.47773,-11.73685 0,-16.21458l-12.45208,-12.45208c-2.23887,-2.23887 -5.17326,-3.35937 -8.10729,-3.35937zM97.46667,45.86667l-67.31068,67.31067c0,0 5.26186,-0.47147 7.22266,1.48933c1.9608,1.9608 0.34669,14.792 2.75469,17.2c2.408,2.408 15.15831,0.71299 16.98724,2.54192c1.82894,1.82893 1.70209,7.43542 1.70209,7.43542l67.31067,-67.31067zM22.93333,131.86667l-5.40859,15.31875c-0.21262,0.60453 -0.32239,1.24042 -0.32474,1.88125c0,3.16643 2.5669,5.73333 5.73333,5.73333c0.64083,-0.00235 1.27672,-0.11212 1.88125,-0.32474c0.0187,-0.00737 0.03737,-0.01483 0.05599,-0.02239l0.14557,-0.04479c0.01122,-0.00743 0.02242,-0.01489 0.03359,-0.0224l15.08359,-5.31901l-8.6,-8.6z"></path></g></g></svg>';
    tableRow = document.createElement("tr");
    switch (response[i].event) {
      case "urlOpened":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Open URL"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerText = response[i].url;
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = "";
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "click":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Click"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerText = "";
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = (
          response[i].innerText ? "Text: " + response[i].innerText.replaceAll(/\n/ig, "").replaceAll("   ", "")
            : response[i].placeholder ? "Placeholder: " + response[i].placeholder.replaceAll(/\n/ig, "").replaceAll("   ", "")
              : response[i].id ? "ID: " + response[i].id.replaceAll(/\n/ig, "").replaceAll("   ", "")
                : response[i].className ? "Class: " + response[i].className.replaceAll(/\n/ig, "").replaceAll("   ", "")
                  : response[i].title ? "Title: " + response[i].title
                    : response[i].tagName ? "Tag: " + response[i].tagName.toLowerCase() : ""
        );
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "keyup":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Type"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerText = response[i].key;
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = (
          response[i].innerText ? "Text: " + response[i].innerText.replaceAll(/\n/ig, "").replaceAll("   ", "")
            : response[i].placeholder ? "Placeholder: " + response[i].placeholder.replaceAll(/\n/ig, "").replaceAll("   ", "")
              : response[i].id ? "ID: " + response[i].id.replaceAll(/\n/ig, "").replaceAll("   ", "")
                : response[i].className ? "Class: " + response[i].className.replaceAll(/\n/ig, "").replaceAll("   ", "")
                  : response[i].title ? "Title: " + response[i].title
                    : response[i].tagName ? "Tag: " + response[i].tagName.toLowerCase() : ""
        );
        tableColumnInput.style = 'color:#b3ffd9;font-weight:bold';
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "ASSERT_ELEMENT_TEXT":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Assert Text"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerHTML = "Expected Text: <b>" + response[i].innerText + "</b>";
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = (
          response[i].innerText ? "Text: " + response[i].innerText.replaceAll(/\n/ig, "").replaceAll("   ", "")
            : response[i].placeholder ? "Placeholder: " + response[i].placeholder.replaceAll(/\n/ig, "").replaceAll("   ", "")
              : response[i].id ? "ID: " + response[i].id.replaceAll(/\n/ig, "").replaceAll("   ", "")
                : response[i].className ? "Class: " + response[i].className.replaceAll(/\n/ig, "").replaceAll("   ", "")
                  : response[i].title ? "Title: " + response[i].title
                    : response[i].tagName ? "Tag: " + response[i].tagName.toLowerCase() : ""
        );
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "ASSERT_ELEMENT_PRESENT":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Assert Element Present"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerHTML = "";
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = (
          response[i].innerText ? "Text: " + response[i].innerText.replaceAll(/\n/ig, "").replaceAll("   ", "")
            : response[i].placeholder ? "Placeholder: " + response[i].placeholder.replaceAll(/\n/ig, "").replaceAll("   ", "")
              : response[i].id ? "ID: " + response[i].id.replaceAll(/\n/ig, "").replaceAll("   ", "")
                : response[i].className ? "Class: " + response[i].className.replaceAll(/\n/ig, "").replaceAll("   ", "")
                  : response[i].title ? "Title: " + response[i].title
                    : response[i].tagName ? "Tag: " + response[i].tagName.toLowerCase() : ""
        );
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "ASSERT_ELEMENT_NOT_PRESENT":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Assert Element Not Present"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerHTML = "";
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = (
          response[i].innerText ? "Text: " + response[i].innerText.replaceAll(/\n/ig, "").replaceAll("   ", "")
            : response[i].placeholder ? "Placeholder: " + response[i].placeholder.replaceAll(/\n/ig, "").replaceAll("   ", "")
              : response[i].id ? "ID: " + response[i].id.replaceAll(/\n/ig, "").replaceAll("   ", "")
                : response[i].className ? "Class: " + response[i].className.replaceAll(/\n/ig, "").replaceAll("   ", "")
                  : response[i].title ? "Title: " + response[i].title
                    : response[i].tagName ? "Tag: " + response[i].tagName.toLowerCase() : ""
        );
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "ASSERT_ELEMENT_TEXT":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Assert Text"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerHTML = "Expected Text: <b>" + response[i].innerText + "</b>";
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = (
          response[i].innerText ? "Text: " + response[i].innerText.replaceAll(/\n/ig, "").replaceAll("   ", "")
            : response[i].placeholder ? "Placeholder: " + response[i].placeholder.replaceAll(/\n/ig, "").replaceAll("   ", "")
              : response[i].id ? "ID: " + response[i].id.replaceAll(/\n/ig, "").replaceAll("   ", "")
                : response[i].className ? "Class: " + response[i].className.replaceAll(/\n/ig, "").replaceAll("   ", "")
                  : response[i].title ? "Title: " + response[i].title
                    : response[i].tagName ? "Tag: " + response[i].tagName.toLowerCase() : ""
        );
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "ASSERT_CURRENT_URL":
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Assert Current URL"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerHTML = "Expected: <b>" + response[i].info.pageUrl + "</b>";
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = ""
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;

      case "ASSERT_PAGE_TITLE":
        console.log(response[i])
        tableColumnStep = document.createElement("td");
        tableColumnStep.innerText = "Assert Title"
        tableColumnInput = document.createElement("td");
        tableColumnInput.innerHTML = "Expected Title: <b>" + response[i].pageTitle + "</b>";
        tableColumnElement = document.createElement("td");
        tableColumnElement.innerText = "";
        tableColumnEditButton = document.createElement("td");
        tableColumnEditButton.innerHTML = editIcon;
        tableRow.appendChild(tableColumnStep)
        tableRow.appendChild(tableColumnElement)
        tableRow.appendChild(tableColumnInput)
        tableRow.appendChild(tableColumnEditButton)
        tableBody.appendChild(tableRow);
        break;
    }

    if (tableColumnStep) {
      tableColumnStep.style = "font-weight:bolder;color:yellow;"
    }
    steps++;
    table.appendChild(tableBody)
    division.appendChild(table);
    maindivision.appendChild(division)
  }
  maindivision.appendChild(hiddenTestCaseId)
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("dashboard").addEventListener("click", moveToDashboard);
  dataText = document.createElement("div");
  dataSpan = document.createElement("span");
  dataSpan.innerText = "Run Test on Following data";
  dataSpan.style = "font-weight:bolder;font-size:16px;color:white;"
  dataText.style = "font-weight:bolder;font-size:16px;color:white; margin-top:20px;width:100%"
  plusIcon = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"'
    + 'width="24" height="24"'
    + 'viewBox="0 0 172 172"'
    + 'style=" fill:#000000;vertical-align:bottom"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none" stroke="none" stroke-width="1"></path><g fill="#ffffff" stroke="none" stroke-width="1"><path d="M86,14.33333c-39.49552,0 -71.66667,32.17115 -71.66667,71.66667c0,39.49552 32.17115,71.66667 71.66667,71.66667c39.49552,0 71.66667,-32.17115 71.66667,-71.66667c0,-39.49552 -32.17115,-71.66667 -71.66667,-71.66667zM86,28.66667c31.74921,0 57.33333,25.58412 57.33333,57.33333c0,31.74921 -25.58412,57.33333 -57.33333,57.33333c-31.74921,0 -57.33333,-25.58412 -57.33333,-57.33333c0,-31.74921 25.58412,-57.33333 57.33333,-57.33333zM78.83333,50.16667v28.66667h-28.66667v14.33333h28.66667v28.66667h14.33333v-28.66667h28.66667v-14.33333h-28.66667v-28.66667z"></path></g><g fill="#8f9d05" stroke="none" stroke-width="1"><path d="M81.835,148.48l-0.27,-0.74h-1.19l-0.27,0.74h-0.39l1.09,-2.84h0.33l1.09,2.84zM80.965,146.1l-0.48,1.33h0.97zM82.455,147.43v-0.02c0,-0.32667 0.08,-0.59 0.24,-0.79c0.15333,-0.19333 0.35333,-0.29 0.6,-0.29v0c0.24667,0 0.44333,0.08333 0.59,0.25v0v-1.1h0.36v3h-0.33l-0.02,-0.23c-0.14667,0.18 -0.34667,0.27 -0.6,0.27v0c-0.24667,0 -0.44667,-0.1 -0.6,-0.3c-0.16,-0.2 -0.24,-0.46333 -0.24,-0.79zM82.825,147.45v0c0,0.24 0.04667,0.42667 0.14,0.56c0.1,0.13333 0.23667,0.2 0.41,0.2v0c0.23333,0 0.40333,-0.10333 0.51,-0.31v0v-0.97c-0.11333,-0.2 -0.28,-0.3 -0.5,-0.3v0c-0.18,0 -0.32,0.07 -0.42,0.21c-0.09333,0.13333 -0.14,0.33667 -0.14,0.61zM84.715,147.43v-0.02c0,-0.32667 0.07667,-0.59 0.23,-0.79c0.15333,-0.19333 0.35333,-0.29 0.6,-0.29v0c0.25333,0 0.45,0.08333 0.59,0.25v0v-1.1h0.36v3h-0.33l-0.02,-0.23c-0.14,0.18 -0.34,0.27 -0.6,0.27v0c-0.24667,0 -0.44667,-0.1 -0.6,-0.3c-0.15333,-0.2 -0.23,-0.46333 -0.23,-0.79zM85.075,147.45v0c0,0.24 0.05,0.42667 0.15,0.56c0.1,0.13333 0.23667,0.2 0.41,0.2v0c0.22667,0 0.39333,-0.10333 0.5,-0.31v0v-0.97c-0.10667,-0.2 -0.27333,-0.3 -0.5,-0.3v0c-0.17333,0 -0.31,0.07 -0.41,0.21c-0.1,0.13333 -0.15,0.33667 -0.15,0.61zM89.075,146.36v0.33c-0.06,-0.00667 -0.12,-0.01 -0.18,-0.01v0c-0.24,0 -0.4,0.1 -0.48,0.3v0v1.5h-0.37v-2.11h0.36v0.24c0.12,-0.18667 0.29,-0.28 0.51,-0.28v0c0.06667,0 0.12,0.01 0.16,0.03zM89.265,147.43v-0.03c0,-0.20667 0.04333,-0.39 0.13,-0.55c0.08,-0.16667 0.19333,-0.29667 0.34,-0.39c0.14,-0.08667 0.30333,-0.13 0.49,-0.13v0c0.28667,0 0.52,0.1 0.7,0.3c0.18,0.2 0.27,0.46333 0.27,0.79v0v0.03c0,0.20667 -0.04,0.39 -0.12,0.55c-0.08,0.16667 -0.19333,0.29333 -0.34,0.38c-0.14667,0.09333 -0.31333,0.14 -0.5,0.14v0c-0.28667,0 -0.52,-0.1 -0.7,-0.3c-0.18,-0.2 -0.27,-0.46333 -0.27,-0.79zM89.635,147.45v0c0,0.23333 0.05333,0.42 0.16,0.56c0.10667,0.14 0.25333,0.21 0.44,0.21v0c0.18,0 0.32333,-0.07 0.43,-0.21c0.11333,-0.14667 0.17,-0.35 0.17,-0.61v0c0,-0.22667 -0.05667,-0.41333 -0.17,-0.56c-0.10667,-0.14667 -0.25333,-0.22 -0.44,-0.22v0c-0.18,0 -0.32333,0.07333 -0.43,0.22c-0.10667,0.14 -0.16,0.34333 -0.16,0.61zM93.015,146.37l0.5,1.61l0.41,-1.61h0.36l-0.62,2.11h-0.29l-0.51,-1.6l-0.5,1.6h-0.3l-0.61,-2.11h0.36l0.42,1.58l0.49,-1.58z"></path></g><path d="M69.715,158.52v-23.04h34.57v23.04z" fill="#ff0000" stroke="#50e3c2" stroke-width="3" opacity="0"></path></g></svg>'
  plushyperlInk = document.createElement("a");
  plushyperlInk.innerHTML = plusIcon;
  plushyperlInk.style = "vertical-align:bottom;float:right;width:5%"
  plushyperlInk.href = "#";
  dataText.appendChild(dataSpan);
  dataText.appendChild(plushyperlInk);
  maindivision.appendChild(dataText)
  document.getElementsByClassName("container1")[0].appendChild(maindivision);
  document.getElementById("testCaseName").innerHTML = "<p style='text-align:center;font-family:Andale Mono,monospace;font-size: 20px;'>Scenario: " + id + "</p>";
  plushyperlInk.addEventListener('click', createTable);
}
function moveToDashboard() {
  document.getElementsByClassName("container1")[0].style.display = 'none';
  document.getElementsByClassName("container")[0].style.display = 'block';
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get("TestCase", function (response) {
    document.getElementById("dashboard").style.display = "none";
    for (i = 0; i < response.TestCase.length; i++) {
      var div = document.createElement("div");
      div.style.width = "100%";
      div.style.float = "right";
      var testCaseLink = document.createElement("a");
      testCaseLink.href = "#";
      testCaseLink.addEventListener('click', clickTestCase, true);
      testCaseLink.response = response.TestCase[i].steps;
      if (response.TestCase[i].name != "") {
        testCaseLink.innerText = response.TestCase[i].name;
        testCaseLink.data = response.TestCase[i].name;
      } else {
        testCaseLink.innerText = "Test Case " + (i + 1);
      }
      testCaseLink.id = (i + 1);
      testCaseLink.style = "padding:20px; font-size:16px;text-decoration:none;";
      statustext = document.createElement("span");
      statustext.id = "status_" + (i);

      editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.id = "edit" + (i + 1);
      editBtn.className = "editTest glow-on-hover glow-on-hover-small";
      editBtn.style.float = 'right';
      div.innerHTML = "<input type='checkbox' id='checkbox_" + (i + 1) + "' class='inputCheckbox'/>";
      div.appendChild(testCaseLink);
      div.appendChild(statustext);
      div.appendChild(editBtn);
      document.querySelector(".container").appendChild(div)
      editBtn.addEventListener("click", function (event) {
        temp = prompt("Enter a name for Testcase");
        if (temp) {
          id = event.target.id;
          idTest = id.substr(4);
          console.log(idTest);
          document.getElementById(idTest).innerText = temp;
          chrome.storage.local.get("TestCase", function (response) {
            response.TestCase[parseInt(idTest) - 1].name = temp;
            chrome.storage.local.set(response);
            document.getElementById(idTest).data = temp;
          })
        }
      })
    }
  });

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.message) {
        console.log(request.message);
        if (request.message == "Select Check boxes") {
          document.getElementsByClassName("heading122")[0].innerText = "Select Checkboxes!";
          document.getElementsByClassName("heading122")[0].style.color = "red";
        } else if (request.message == "AllTestCaseDone") {
          document.getElementsByClassName("heading122")[0].innerText = "All Test Case Done!";
        } else {
          console.log(request);
          console.log(request.message.split("_")[1]);
          if (document.getElementById("status_" + (request.message.split("_")[1]))) {
            document.getElementById("status_" + (request.message.split("_")[1])).innerText = request.message.split("_")[0].replace("testCase", "");
          }
        }
      }
    }
  );
  document.getElementById("exportTestCases").addEventListener('click', exportTestCase);
  document.getElementById("importTestCases").addEventListener('click', openPopup);
  document.getElementById("uploadFile").addEventListener('change', importTestCase)
});

function openPopup(event) {
  document.getElementById("importPopupOpen").click();
}

function importTestCase(event) {
  file = event.target.files;
  var reader = new FileReader();
  reader.onload = handleFileRead;
  reader.readAsText(file[0]);
}

function handleFileRead(event) {
  var save = JSON.parse(event.target.result);
  if (save.TestCase.length > 0) {
    if (save.TestCase[0].hasOwnProperty("name") && save.TestCase[0].steps.length > 0) {
      chrome.storage.local.set(save);
      document.getElementById("close").click();
      location.reload();
    } else {
      console.log("File Format not proper")
    }
  } else {
    console.log("File Format not proper");
  }
}

function exportTestCase() {
  fileName = new Date().getTime();
  var a = {};
  chrome.storage.local.get("TestCase", function (response) {
    a = response;
    var textToSave = JSON.stringify(JSON.parse(JSON.stringify(a)), null, 2);
    var textToSaveAsBlob = new Blob([textToSave], {
      type: "application/json"
    });
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var downloadLink = document.createElement("a")
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = function () {
      document.body.removeChild(event.target);
    };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  });
}

function createTable() {
  if (!document.getElementById("dataSet")) {
    divisiontable = document.createElement("div");
    divisiontable.style.margin = "56px";
    formElement = document.createElement("form");
    formElement.id = "dataForm"
    tableVal = document.createElement("table");
    tableVal.id = "dataSet";
    tableHead = "";
    tableHead = document.createElement("thead");
    columnName = document.createElement("th");
    columnName.innerText = "Column Names"
    columnHeading = document.createElement("th");
    columnHeading.innerHTML = "<input type='text' placeholder='Please Enter Column Name' id='columnName_1' required>";
    columnHeading1 = document.createElement("th");
    columnHeading1.innerHTML = "<input type='button' value='Add Column' id='addColumn'>";

    tableHead.appendChild(columnName);
    tableHead.appendChild(columnHeading);
    tableHead.appendChild(columnHeading1)
    tableVal.appendChild(tableHead);
    tableBody = document.createElement("tbody");
    tableBody.id="tableBody"
    tableBody.innerHTML = "<tr><td>Row 1</td><td><input type='text' placeholder='Please Enter Column Value' id='columnValue_1' required></td></tr>"
    buttonSubmit = document.createElement("button");
    buttonSubmit.type = "submit";
    buttonSubmit.id = "submitData";
    buttonSubmit.innerText = "Add Data";
    buttonSubmit.style = "float:right"
    tableVal.appendChild(tableBody);
    formElement.appendChild(tableVal)
    formElement.appendChild(buttonSubmit);
    divisiontable.appendChild(formElement);
    document.getElementsByClassName("container1")[0].appendChild(divisiontable);
    document.getElementById("addColumn").addEventListener("click", addColumn);
    document.getElementById("dataForm").addEventListener("submit", submitData);
  }
}
function submitData(event) {
  event.preventDefault();
  testCaseId = document.getElementById("testCaseId").value;
  element = document.querySelectorAll("input[id*='columnValue_']");
  columnName = document.querySelectorAll("input[id*='columnName_']");
  for (i = 0; i < element.length; i++) {
    data.push({ columnNumber: i, columnName: columnName[i].value, rowValue: [element[i].value] });
    element[i].disabled = true;
    columnName[i].disabled = true;
  }
  console.log(data);
  chrome.storage.local.get("TestCase", function (testCase) {
    testCase.TestCase[testCaseId - 1].data = data;
    chrome.storage.local.set(testCase)
  })
}

function addColumn() {
  var numberofRows = document.getElementById("dataSet").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length
  var numberOfColumns = document.getElementById("dataSet").getElementsByTagName("tr")[0].getElementsByTagName("td").length;
  thead = document.getElementById("dataSet").getElementsByTagName("thead")[0].innerHTML
  array = thead.split("</th>");
  value = "";
  for (i = 0; i < array.length - 2; i++) {
    value = value + "" + array[i] + "</th>";
  }
  value = value + "<th><input type='text' placeholder='Please Enter Column Name' id='columnName_" + numberOfColumns + "' required></th>";
  value = value + array[array.length - 2] + "</th>";
  document.getElementById("dataSet").getElementsByTagName("thead")[0].innerHTML = value;
  for (row = 0; row < numberofRows; row++) {
    innerHTML = "<td><input type='text' placeholder='Please Enter Column Value' id='columnValue_" + numberOfColumns + "'></td>"
    document.getElementById("dataSet").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[row].innerHTML = document.getElementById("dataSet").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[row].innerHTML + "" + innerHTML
  }
  document.getElementById("addColumn").addEventListener("click", addColumn);
}