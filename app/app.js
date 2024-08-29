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

/* Listen for socket connection on port 3002 */
socketServer.listen(3002, function () {
    console.log('Socket server listening on : 3002');
});

/* This event will emit when client connects to the socket server */
// io.on('connection', function (socket) {
//     console.log(socket);

//     console.log('Socket connection established');
// });

io.on('connection', async function (socket) {
    await socket.on("urlOpened", async function (data, fn) {
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
            await fn({ message: "url opened" });
        }).catch(async function (e) {
            console.log(e.message);
        })
    })

    await socket.on("click", async function (data, fn) {
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
                        await fn({ message: "element clicked" });
                    }).catch(function (e) {
                        console.log(e.message);
                    })
                } else if (data.className) {
                    var elements = await driver.findElements(By.className(data.className))
                    if (elements.length == 1) {
                        await elements[0].click();
                    } else if (elements.length > 1) {
                        if (data.innerText) {
                            await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                                if (element.isDisplayed()) {
                                    await element.click();
                                    await fn({ message: "Clicked" });
                                } else {
                                    element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                                    await element.click();
                                }
                            }).catch(async function (e) {
                                element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                                await element.click();
                                console.log(e.message);
                            });
                        }
                    }
                    await fn({ message: "element clicked" });
                } else if (data.title) {
                    console.log(data.title)
                    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]"))), 20)
                    await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]")).then(async function (element) {
                        await driver.actions().mouseMove(element).click().perform();
                        await fn({ message: "Clicked" });
                    }).catch(function (e) {
                        console.log(e.message);
                    });
                } else if (data.innerText) {
                    console.log(data.innerText)
                    driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]"))), 20);
                    await driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                        await element.click();
                        await fn({ message: "Clicked" });
                    }).catch(function (e) {
                        console.log(e.message);
                    });
                } else if (data.clientX) {
                    var element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                    await driver.actions.mouseMove(element).click().perform();
                    await fn({ message: "Clicked" });
                }
            }).catch(function (e) {
                console.log(e.message);
            })
        } else {
            await fn({ message: "Driver Closed" });;
        }
    })

    await socket.on("keyup", async function (data, fn) {
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
                            await fn({ message: "value entered" });
                        })
                    } else if (data.id) {
                        await driver.wait(until.elementIsVisible(driver.findElement(By.id(data.id))), 10)
                        await driver.findElement(By.id(data.id)).then(async function (element) {
                            element.sendKeys(data.key);
                            await fn({ message: "value entered" });
                        })
                    } else if (data.className) {
                        var elements = await driver.findElements(By.className(data.className))
                        if (elements.length == 1) {
                            await elements.sendKeys(data.key);
                        }
                        await fn({ message: "value entered" });
                    }
                } else {
                    await fn({ message: "Driver Closed" });
                }
            }).catch(function (e) {
                console.log(e.message);
            })
        }
    })

    await socket.on("mouseover", async function (data, fn) {
        if (driver) {
            await sleep(2000).then(async function (sa) {
                await waitForPageLoad(driver);
                handles = await driver.getAllWindowHandles();
                if (handles.length > 1) {
                    await driver.switchTo().window(handles[handles.length - 1])
                }
                if (data.id) {
                    await driver.findElement(By.id(data.id)).then(async function (element) {
                        await driver.actions().mouseMove(element).mouseMove(element).perform();
                        await fn({ message: "Hovered" });
                    }).catch(async function (e) {
                        console.log(e.message);
                        await fn({ message: "Hovered" });
                    })
                } else if (data.className) {
                    var elements = await driver.findElements(By.className(data.className))
                    if (elements.length == 1) {
                        await driver.actions().mouseMove(elements[0]).mouseMove(elements[0]).perform();
                        await fn({ message: "Hovered" });
                    } else if (data.title) {
                        await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]"))), 10)
                        driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]")).then(async function (element) {
                            await driver.actions().mouseMove(element).mouseMove(element).perform();
                            await fn({ message: "Hovered" });
                        }).catch(async function (e) {
                            console.log(e.message);
                            await fn({ message: "Hovered" });
                        });
                        await fn({ message: "Hovered" });
                    } else if (data.clientX) {
                        var element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                        await driver.actions().mouseMove(element).mouseMove(element).perform();
                        await fn({ message: "Hovered" });
                    } else if (data.innerText) {
                        await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]"))), 10)
                        driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                            await driver.actions().mouseMove(element).mouseMove(element).perform();
                            await fn({ message: "Hovered" });
                        }).catch(async function (e) {
                            console.log(e.message);
                            await fn({ message: "Hovered" });
                        });
                    }

                } else if (data.title) {
                    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]"))), 10)
                    driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(@title,'" + data.title + "')]")).then(async function (element) {
                        await driver.actions().mouseMove(element).mouseMove(element).perform();
                        await fn({ message: "Hovered" });
                    }).catch(async function (e) {
                        console.log(e.message);
                        await fn({ message: "Hovered" });
                    });
                } else if (data.clientX) {
                    var element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                    await driver.actions().mouseMove(element).mouseMove(element).perform();
                    await fn({ message: "Hovered" });
                } else if (data.innerText) {
                    driver.findElement(By.xpath("//" + data.tagName.toLowerCase() + "[contains(text(),'" + data.innerText + "')]")).then(async function (element) {
                        await driver.actions().mouseMove(element).mouseMove(element).perform();
                        await fn({ message: "Hovered" });
                    }).catch(async function (e) {
                        console.log(e.message);
                        await fn({ message: "Hovered" });
                    });
                }// } else if (data.clientX) {
                //     var element = await driver.executeScript("return document.elementFromPoint(arguments[0],arguments[1])", data.clientX, data.clientY);
                //     console.log("X Y position");
                //     await driver.actions().mouseMove(element).mouseMove(element).perform();
                //     await fn({ message: "Hovered" });
                // }
            }).catch(async function (e) {
                await fn({ message: "Hovered" });
                console.log(e.message);
            })
        } else {
            await fn({ message: "Driver Closed" });
        }
    })

    await socket.on("testCasecomplete", async function (data, fn) {
        if (driver) {
            driver.quit();
            await fn({ message: "Closed" });
        }
    });

    await socket.on("ASSERT_ELEMENT_TEXT", async function (data, fn) {
        if (driver) {
            await sleep(2000).then(async function (sa) {
                await waitForPageLoad(driver);
                handles = await driver.getAllWindowHandles();
                if (handles.length > 1) {
                    await driver.switchTo().window(handles[handles.length - 1])
                }
                if (data.id) {
                    driver.findElement(By.id(data.id)).then(function (element) {
                        element.getText().then(function (text) {
                            console.log(text);
                            if (data.innerText=="Login12") {
                                fn("Assert Pass")
                            } else {
                                socket.emit("Assert Failed",{"actual":data.innerText,"expected":" Login12"});
                            }
                        }).catch(function (e) {
                            console.log(e);
                        })
                    }).catch(function (e) {
                        console.log(e.message);
                    })
                }
            })
        }
    })
})

/* Create HTTP server for node application */
var server = require('http').createServer(app);

/* Node application will be running on 3000 port */
server.listen(3000);

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function waitForPageLoad(driver) {
    await driver.wait(async function () {
        return await driver.executeScript('return document.readyState').then(function (readyState) {
            return readyState === 'complete';
        }).catch(async function (e) {
            console.log(e.message);
        });
    }, 25);
}
