/*
 *  Document    : background.js
 *  Author      : ogbizi
 *  Dependencies: chrome api
 */
"use strict";
var CMD_CUT = "tabs-cut";
var CMD_COPY = "tabs-copy";
var CMD_PASTE = "tabs-paste";
var CMD_DUP = "tabs-duplicate";
var CMD_UNDO = "tabs-paste-undo";
var CMD_MOVE_NEXT = "tabs-move-next";
var CMD_MOVE_PREV = "tabs-move-prev";

var app = function () {
    // track tabs handled by app
    var mTabs = {};
    // list of tabs last handled
    var lastTabs = [];
    // last command executed
    var lastCommand;
    // window tabs were pasted from
    var sourceWindow;

    // get tab id from tab objects
    var getTabIds = function (tabs) {
        var tabIds = tabs.map(function (t) {
            return t.id;
        });
        console.log("tab ids: ", tabIds);
        return tabIds;
    };

    return {
        /**
         * Set window the last tabs are moved from
         * @param window
         */
        setSourceWindow: function (window) {
            console.log('set source window:', window);
            sourceWindow = window;
        },
        /**
         * Place tabs in specified window
         * @param window target window
         * @param tabs list of tabs to place
         * @param command triggered the action
         * @returns
         */
        pasteTabs: function (window, tabs, command) {
            console.log("paste tabs:", window, tabs, command);
            lastCommand = command;
            lastTabs = tabs;
            // save tab indexes
            // and perform move
            this.doMove(window, tabs, true);
            // switch to target window
            chrome.windows.update(window.id, {
                focused: true
            });
        },
        /**
         * Undo last command
         * currently only supports move action
         */
        undoLastCommand: function () {
            console.log('reverse', lastCommand, lastTabs, sourceWindow);
            if (sourceWindow == undefined || lastCommand == undefined) {
                return false;
            } else {
                // switch to source window
                chrome.windows.update(sourceWindow.id, {
                    focused: true
                });
                // perform undo move
                // do not save current tab indexes
                this.doMove(sourceWindow, lastTabs, false);
                // reset undo 
                lastTabs = [];
                lastCommand = undefined;
                sourceWindow = undefined;
            }
            return true;
        },
        /**
         * Perform move on tabs
         * @param window the target window
         * @param tabs the tabs to move
         * @param record the position of the tabs (boolean)
         */
        doMove: function (window, tabs, record) {
            var wId = window == undefined ? undefined : window.id;
            // save active tab
            var activeTab;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].active) {
                    activeTab = tabs[i];
                    break;
                }
            }
            // save tab indexes
            // and perform move
            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];
                if (record) {
                    if (mTabs[tab.id] == undefined) {
                        mTabs[tab.id] = {};
                    }
                    mTabs[tab.id][tab.windowId] = tab.index;
                }
                var targetIdx = -1;
                if (mTabs[tab.id][wId] != undefined) {
                    targetIdx = mTabs[tab.id][wId];
                }
                chrome.tabs.move(tab.id, {
                    windowId: wId,
                    index: targetIdx
                });
            }
            // restore active tab
            chrome.tabs.update(activeTab.id, {
                active: true
            });
            // highlight all handled tabs
            tabs.map(function (t) {
                chrome.tabs.update(t.id, {
                    highlighted: true
                });
            });
            // switch to window
            chrome.windows.update(wId, {
                focused: true
            });
        }
    };
}();

chrome.commands.onCommand.addListener(function (command) {
    console.log('command listener:', command);
    switch (command) {
        case CMD_UNDO:
            if (app.undoLastCommand()) {
                console.log("undo successful");
            } else {
                console.log("undo failed");
            }
            break;
        case CMD_CUT:
        case CMD_MOVE_NEXT:
        case CMD_MOVE_PREV:
            chrome.windows.getLastFocused({}, function (window) {
                console.log("move from window:", window);
                app.setSourceWindow(window);
                chrome.tabs.query({
                    highlighted: true,
                    windowId: window.id
                }, function (tabs) {
                    chrome.windows.getAll({
                        windowTypes: ['normal']
                    }, function (windows) {
                        if (windows.length == 1 || command == CMD_CUT) {
                            var tabA = tabs[0];
                            chrome.windows.create({
                                    tabId: tabA.id
                                },
                                function (nWindow) {
                                    app.pasteTabs(nWindow, tabs, command);
                                });
                        } else {
                            var idx = 0;
                            do {
                                if (windows[idx].id == window.id) {
                                    idx += (command == CMD_MOVE_NEXT ? 1 : -1);
                                    break;
                                }
                            } while (++idx < windows.length);
                            if (idx == windows.length) idx = 0;
                            else if (idx < 0) idx = windows.length - 1;
                            var nWindow = windows[idx];
                            app.pasteTabs(nWindow, tabs, command);
                        }
                    });
                });
            });
            break;
    }
});
