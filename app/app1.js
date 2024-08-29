const e = require('express');
var express = require('express');
var app = express();
const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver');
require('chromedriver');
var driver;
// Socket connection

/* Creates new HTTP server for socket */
var socketServer = require('http').createServer(app);
var io = require('socket.io')(socketServer, {
    cors: {
        origin: "http://localhost:8100",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
var socketV;
var assertMessage;
var assertFailed = false;
/* Listen for socket connection on port 3002 */
socketServer.listen(3002, function () {
    console.log('Socket server listening on : 3002');
});


io.on('connection', function (socket) {
    console.log("Connected");
    socketV = socket;
    socket.on("play", function (response) {
        start(response.steps);
    })

    socket.on('end', function () {
        socket.disconnect(0);
    });

    // await socket.on("testCasecomplete", async function (data, fn) {
    //     if (driver) {
    //         driver.quit();
    //         await fn({ message: "Closed" });
    //     }
    // })


})

async function getWait(event) {
    if (event == "ASSERT_ELEMENT_TEXT" || event == "ASSERT_CURRENT_URL" || event == "ASSERT_ELEMENT_PRESENT") {
        waitVal = 1500;
    } else if (event == "click") {
        waitVal = 1000
    } else if (event == "keyup") {
        waitVal = 300;
    } else if (event == "urlOpened") {
        waitVal = 3000;
    } else {
        waitVal = 600;
    }
    console.log(waitVal);
    return waitVal;
}
async function start(response) {
    if (response) {
        await urlOpen(response[0]);
        for (index = 1; index < response.length; index++) {
            if (assertFailed) {
                socketV.emit("assertFailed", assertMessage);
                driver.quit();
                break;
            }
            if (response[index]) {
                await wait(await getWait(response[index].event), response, index).then((response) => { play(response); })
            }
        }
        if (index != 0 && index == response.length) {
            var msg = { action: 'done' };
            socketV.emit("done", msg);
            console.log(msg);
            driver.quit();
        }
    }
}

function play(testCaseSteps) {
    if (testCaseSteps.event == "click") {
        click(testCaseSteps);
    }
    
    if (testCaseSteps.event == "keyup") {
        enterData(testCaseSteps);
    }

    if (testCaseSteps.event == "mouseover") {
        hover(testCaseSteps);
    }

    if (testCaseSteps.event == "ASSERT_ELEMENT_TEXT") {
        assertText(testCaseSteps);
    }

    if (testCaseSteps.event == "ASSERT_CURRENT_URL") {
        assertCurrentURL(testCaseSteps);
    }

    if (testCaseSteps.event == "ASSERT_ELEMENT_PRESENT") {
        assertElementPresent(testCaseSteps);
    }

    if (testCaseSteps.event == "ASSERT_ELEMENT_NOT_PRESENT") {
        assertElementNotPresent(testCaseSteps);
    }

    if (testCaseSteps.event == "ASSERT_PAGE_TITLE") {
        assertPageTitle(testCaseSteps);
    }
}

/* Create HTTP server for node application */
var server = require('http').createServer(app);

/* Node application will be running on 3000 port */
server.listen(3000);

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function wait(ms, request, index) {
    return new Promise(resolve => { setTimeout(() => { resolve(request[index]) }, ms) });
}

async function waitForPageLoad(driver) {
    await driver.wait(async function () {
        return await driver.executeScript('return document.readyState').then(function (readyState) {
            return readyState === 'complete';
        }).catch(async function (e) {
            console.log(e.message);
        });
    }, 25).catch(function (e) {
        console.log("Page Load Time out");
    });
}

async function assertText(data) {
    if (driver) {
        await waitForPageLoad(driver);
        handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.switchTo().window(handles[handles.length - 1])
        }
        if (data.id) {
            driver.findElement(By.id(data.id)).then(function (element) {
                element.getText().then(function (text) {
                    console.log(text);
                    if (data.innerText == text) {
                        assertFailed = false;
                    } else {
                        assertFailed = true;
                        assertMessage = { "actual": data.innerText, "expected": text }
                        console.log("assert failed")
                    }
                }).catch(function (e) {
                    console.log(e);
                })
            }).catch(function (e) {
                console.log(e.message);
            })
        } else if (data.innerText) {
            driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                element.getText().then(function (text) {
                    console.log(text);
                    if (data.innerText == text) {
                        assertFailed = false;
                    } else {
                        assertFailed = true;
                        assertMessage = { "actual": data.innerText, "expected": text }
                        console.log("assert failed")
                    }
                }).catch(function (e) {
                    console.log(e);
                })
            }).catch(async function (e) {
                console.log(e.message);
            });
        } else if (data.className) {
            var elements = await driver.findElements(By.className(data.className))
            if (elements.length == 1) {
                elements[0].getText().then(function (text) {
                    if (data.innerText == text) {
                        assertFailed = false;
                    } else {
                        assertFailed = true;
                        assertMessage = { "actual": data.innerText, "expected": text }
                        console.log("assert failed")
                    }
                }).catch(function (e) {
                    console.log(e);
                })
            }
        }
    }
}

async function assertElementPresent(data) {
    if (driver) {
        await waitForPageLoad(driver);
        handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.switchTo().window(handles[handles.length - 1])
        }
        if (data.id) {
            driver.findElement(By.id(data.id)).then(function (element) {
                if (element) {
                    assertFailed = false;
                } else {
                    assertFailed = true;
                    assertMessage = { "actual": false, "expected": true }
                    console.log("assert failed")
                }
            }).catch(function (e) {
                console.log(e.message);
            })
        } else if (data.innerText) {
            driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                if (element) {
                    assertFailed = false;
                } else {
                    assertFailed = true;
                    assertMessage = { "actual": false, "expected": true }
                    console.log("assert failed")
                }
            }).catch(async function (e) {
                if (data.className) {
                    element = await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[@class='" + data.className + "']"))
                    if (element) {
                        assertFailed = false;
                    } else {
                        assertFailed = true;
                        assertMessage = { "actual": false, "expected": true }
                        console.log("assert failed")
                    }
                }
            });
        } else if (data.className) {
            var elements = await driver.findElements(By.className(data.className))
            if (elements.length >= 1) {
                assertFailed = false;
            } else {
                assertFailed = true;
                assertMessage = { "actual": false, "expected": true }
                console.log("assert failed")
            }
        }
    }
}

async function assertElementNotPresent(data) {
    if (driver) {
        await waitForPageLoad(driver);
        handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.switchTo().window(handles[handles.length - 1])
        }
        if (data.id) {
            driver.findElement(By.id(data.id)).then(function (element) {
                if (!element) {
                    assertFailed = false;
                } else {
                    assertFailed = true;
                    assertMessage = { "actual": false, "expected": true }
                    console.log("assert failed")
                }
            }).catch(function (e) {
                console.log(e.message);
            })
        } else if (data.innerText) {
            driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                if (!element) {
                    assertFailed = false;
                } else {
                    assertFailed = true;
                    assertMessage = { "actual": false, "expected": true }
                    console.log("assert failed")
                }
            }).catch(async function (e) {
                if (data.className) {
                    element = await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[@class='" + data.className + "']"))
                    if (!element) {
                        assertFailed = false;
                    } else {
                        assertFailed = true;
                        assertMessage = { "actual": false, "expected": true }
                        console.log("assert failed")
                    }
                }
            });
        } else if (data.className) {
            var elements = await driver.findElements(By.className(data.className))
            if (elements.length == 0) {
                assertFailed = false;
            } else {
                assertFailed = true;
                assertMessage = { "actual": false, "expected": true }
                console.log("assert failed")
            }
        }
    }
}

async function assertCurrentURL(data) {
    if (driver) {
        await waitForPageLoad(driver);
        handles = await driver.getAllWindowHandles();
        console.log(handles.length);
        if (handles.length > 1) {
            await driver.switchTo().window(handles[handles.length - 1])
            console.log("Switched");
            // await waitForPageLoad(driver);
            url = await driver.getCurrentUrl();
            console.log(data.info.pageUrl);
            console.log(url);
            if (data.info.pageUrl == url) {
                assertFailed = false;
            } else {
                assertFailed = true;
                assertMessage = { "actual": url, "expected": data.info.pageUrl }
                console.log("assert failed")
            }
        } else {
            url = await driver.getCurrentUrl();
            console.log(data.info.pageUrl);
            console.log(url);
            if (data.info.pageUrl == url) {
                assertFailed = false;
            } else {
                assertFailed = true;
                assertMessage = { "actual": url, "expected": data.info.pageUrl }
                console.log("assert failed")
            }
        }
    }
}

async function assertPageTitle(data) {
    if (driver) {
        await waitForPageLoad(driver);
        handles = await driver.getAllWindowHandles();
        console.log(handles.length);
        if (handles.length > 1) {
            await driver.switchTo().window(handles[handles.length - 1])
            console.log("Switched");
            await driver.getTitle().then(function (title) {
                if (data.pageTitle == title) {
                    assertFailed = false;
                } else {
                    assertFailed = true;
                    assertMessage = { "actual": title, "expected": data.pageTitle }
                }
            }).catch(function (e) {
                console.log("Error in title");
            });
        } else {
            await driver.getTitle().then(function (title) {
                if (data.pageTitle == title) {
                    assertFailed = false;
                } else {
                    assertFailed = true;
                    assertMessage = { "actual": title, "expected": data.pageTitle }
                }
            }).catch(function (e) {
                console.log("Error in title");
            });
        }
    }
}


async function hover(data) {
    if (driver) {
        //await waitForPageLoad(driver);
        handles = await driver.getAllWindowHandles();
        if (handles.length > 1) {
            await driver.switchTo().window(handles[handles.length - 1])
        }
        if (data.id) {
            await driver.findElement(By.id(data.id)).then(async function (element) {
                await driver.actions().mouseMove(element).mouseMove(element).perform();
            }).catch(async function (e) {
                console.log(e.message);
            })
        } else if (data.className) {
            var elements = await driver.findElements(By.className(data.className))
            if (elements.length == 1) {
                await driver.actions().mouseMove(elements[0]).mouseMove(elements[0]).perform();
            } else if (data.title) {
                await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]"))), 10)
                driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]")).then(async function (element) {
                    await driver.actions().mouseMove(element).mouseMove(element).perform();
                }).catch(async function (e) {
                    console.log(e.message);
                });
            } else if (data.clientX) {
                var element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                await driver.actions().mouseMove(element).mouseMove(element).perform();
            } else if (data.innerText) {
                await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]"))), 10)
                driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                    await driver.actions().mouseMove(element).mouseMove(element).perform();
                }).catch(async function (e) {
                    console.log(e.message);
                });
            }

        } else if (data.title) {
            await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]"))), 10)
            driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]")).then(async function (element) {
                await driver.actions().mouseMove(element).mouseMove(element).perform();
            }).catch(async function (e) {
                console.log(e.message);
            });
        } else if (data.clientX) {
            await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY).then(async function (element) {
                await driver.actions().mouseMove(element).mouseMove(element).perform();
            }).catch(function (e) {
                console.log(e.message);
            });

        } else if (data.innerText) {
            driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                await driver.actions().mouseMove(element).mouseMove(element).perform();
            }).catch(async function (e) {
                console.log(e.message);
            });
        }

    } else {
    }
}

async function enterData(data) {
    if (driver) {
        await sleep(2000).then(async function (sa) {
            await waitForPageLoad(driver);
            handles = await driver.getAllWindowHandles();
            if (handles.length > 1) {
                await driver.switchTo().window(handles[handles.length - 1])
            }
            if (data.key != "Shift" && data.key != "Tab") {
                if (data.placeholder) {
                    cssLocator = "input[placeholder='" + data.placeholder + "']";
                    await driver.wait(until.elementIsVisible(driver.findElement(By.css(cssLocator))), 10)
                    await driver.findElement(By.css(cssLocator)).then(async function (element) {
                        element.sendKeys(data.key);
                    })
                } else if (data.id) {
                    await driver.wait(until.elementIsVisible(driver.findElement(By.id(data.id))), 10)
                    await driver.findElement(By.id(data.id)).then(async function (element) {
                        element.sendKeys(data.key);
                    })
                } else if (data.className) {
                    var elements = await driver.findElements(By.className(data.className))
                    if (elements.length == 1) {
                        await elements.sendKeys(data.key);
                    }
                }
            } else {
            }
        }).catch(function (e) {
            console.log(e.message);
        })
    }
}

async function click(data) {
    if (driver) {
        await sleep(2000).then(async function (sa) {
            await waitForPageLoad(driver);
            handles = await driver.getAllWindowHandles();
            if (handles.length > 1) {
                await driver.switchTo().window(handles[handles.length - 1])
            }
            if (data.id) {
                console.log(data.id)
                await driver.wait(until.elementIsVisible(driver.findElement(By.id(data.id))), 25).then(async function (response) {
                    await response.click();
                }).catch(function (e) {
                    console.log(e.message);
                })
            } else if (data.className) {
                var elements = await driver.findElements(By.className(data.className))
                if (elements.length == 1) {
                    await driver.actions().mouseMove(elements[0]).click().perform();
                } else if (elements.length > 1) {
                    if (data.innerText) {
                        await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                            if (element.isDisplayed()) {
                                await driver.actions().mouseMove(element).click().perform();
                            } else {
                                await driver.actions().mouseMove(elements[0]).click().perform();
                                // element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                                // await driver.actions().mouseMove(element).click().perform();
                            }
                        }).catch(async function (e) {
                            await driver.findElement(By.className(data.className)).then(async function (element) {
                                await driver.actions().mouseMove().click(element).perform();
                            }).catch(async function (e) {
                                if (e.message == "element not interactable") {
                                    driver.executeScript("document.getElementsByClassName(arguments[0])[0].click()", data.className);
                                } else {
                                    element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                                    await driver.actions().mouseMove(element).click().perform();
                                    console.log(e.message);
                                }
                            })
                            // await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[@class='" + data.className + "']")).then(async function (element) {
                            //     console.log("Class name again.....")
                            //     await driver.actions().mouseMove(element).click().perform();
                            // }).catch(async function (e) {
                            //     console.log("Client X and Y")
                            //     element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                            //     await driver.actions().mouseMove(element).click().perform();
                            //     console.log(e.message);
                            // })
                        });
                    }
                } else if (elements.length == 0) {
                    if (data.innerText) {
                        await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                            if (element.isDisplayed()) {
                                await element.click();
                            } else {
                                element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                                await driver.actions().mouseMove(element).click().perform();
                            }
                        }).catch(async function (e) {
                            element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                            await driver.actions().mouseMove(element).click().perform();
                            console.log(e.message);
                        });
                    }
                }
            } else if (data.title) {
                console.log(data.title)
                await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]"))), 20)
                await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]")).then(async function (element) {
                    await driver.actions().mouseMove(element).click().perform();
                }).catch(async function (e) {
                    element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                    await driver.actions().mouseMove(element).click().perform();
                    console.log(e.message);
                });
            } else if (data.innerText) {
                console.log(data.innerText)
                driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]"))), 20);
                await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                    await driver.actions().mouseMove(element).click().perform();
                    //await element.click();
                }).catch(async function (e) {
                    element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                    await driver.actions().mouseMove(element).click().perform();
                    console.log(e.message);
                });
            } else if (data.clientX) {
                var element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                await driver.actions.mouseMove(element).click().perform();
            }
            await waitForPageLoad(driver);
        }).catch(function (e) {
            console.log(e.message);
        })
    } else {
    }
}

async function urlOpen(data) {
    const { Options } = require('selenium-webdriver/chrome');
    const chromeOptions = new Options();
    chromeOptions.excludeSwitches('enable-logging');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    await driver.manage().window().maximize();
    await driver.manage().timeouts().implicitlyWait(5);
    await driver.get(data.url);
    await driver.wait(async function () {
        return await driver.executeScript('return document.readyState').then(function (readyState) {
            return readyState === 'complete';
        }).catch(async function (e) {
            console.log(e.message);
        });
    });
    await waitForPageLoad(driver);
    await sleep(2000).then(async function (sa) {
        handles = await driver.getAllWindowHandles();
        handle = await driver.getWindowHandle();
        for (i = 1; i < handles.length; i++) {
            await driver.switchTo().window(handles[i]);
            await driver.close();
            await driver.switchTo().window(handle);
        }
    }).catch(async function (e) {
        console.log(e.message);
    })
}