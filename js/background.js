/*
 *  Document    : background.js
 *  Author      : ogbizi
 *  Description : Chrome Tab Genuis background script
 *  Dependencies: chrome api
 *  Domain      : com.chrometabgenius
 */
"use strict";
var CMD_CUT = "tabs-cut";
var CMD_COPY = "tabs-copy";
var CMD_PASTE = "tabs-paste";
var CMD_DUP = "tabs-duplicate";
var CMD_UNDO = "tabs-paste-undo";
var CMD_MOVE_NEXT = "tabs-move-next";
var CMD_MOVE_PREV = "tabs-move-prev";

var app = function() {
    // command to be executed
    var pendingCommand = undefined;
    // array of tabs to be pasted
    var selectedTabs = [];
    // last command executed
    var lastCommand = undefined;
    // window tabs were pasted from
    var sourceWindow = undefined;
    // array of tabs just pasted
    var pastedTabs = [];
    // get tab id from tab objects
    var getTabIds = function (tabs) {
        var tabIds = tabs.map(function (t){ return t.id; });
        console.log("tab ids: ", tabIds);
        return tabIds;
    };
    
    return {
        setSourceWindow: function(window) {
            console.log('set source window:', window);
            sourceWindow = window;
        },
        setPendingCommand: function(command) {
            console.log('set pending command:', command);
            pendingCommand = command;
        },
        getPendingCommand: function() {
            return pendingCommand;
        },
        setSelectedTabs: function(tabs) {
            console.log("set selected tabs:", tabs);
            selectedTabs = tabs;
        },
        getSelectedTabs: function() {
            return selectedTabs;
        },
        pasteTabs: function(window, tabs, command) {
            console.log("paste tabs:", window, tabs, command);
            lastCommand = command;
            pendingCommand = undefined;
            var wId = window == undefined ? undefined : window.id;
            // perform copy/move function
            if(command == CMD_CUT) {
                pastedTabs = [];
                chrome.tabs.move(getTabIds(tabs), {windowId: wId, index:-1}, 
                    function (_tabs) {
                        // save pasted tabs for undo action
                        if(_tabs.length == undefined) {
                            pastedTabs.push(_tabs);
                        } else pastedTabs = _tabs;
                        console.log("moved tabs: ", pastedTabs);
                        // set first tab to active and highlight all
                        chrome.tabs.update(pastedTabs[0].id, {active:true});
                        pastedTabs.map(function(t) {
                            chrome.tabs.update(t.id, {highlighted:true});
                        });
                    });
            } else if(command == CMD_COPY) {
                // TODO use duplication and then move
                pastedTabs = []
                for(var i = 0; i < tabs.length; i++) {
                    // set first tab to active and highlight all
                    chrome.tabs.create({windowId: wId, url: tabs[i].url, 
                        active:true}, 
                        function(tab) {
                            pastedTabs.push(tab);
                            chrome.tabs.update(tab.id, {highlighted:true});
                        });
                }
                console.log("copied tabs: ", pastedTabs);
            }
            // switch to window
            chrome.windows.update(wId, {focused:true});
        },
        undoLastCommand: function() {
            if(lastCommand == undefined || pastedTabs.length == 0) {
                return false;
            } else {
                // switch to source window
                chrome.windows.update(sourceWindow.id, {focused:true});
                if(lastCommand == CMD_COPY) {
                    chrome.tabs.remove(getTabIds(pastedTabs), function() {
                        console.log("removed tabs: ", pastedTabs);
                        pastedTabs = [];
                        sourceWindow = undefined;
                    });
                } else if(lastCommand == CMD_CUT) {
                    chrome.tabs.move(getTabIds(pastedTabs), 
                        {windowId: sourceWindow.id, index:-1}, 
                        function (_tabs) {
                            console.log("unmoved tabs: ", _tabs);
                            // set first tab to active and highlight all
                            chrome.tabs.update(_tabs[0].id, {active:true});
                            _tabs.map(function(t) {
                                chrome.tabs.update(t.id, {highlighted:true});
                            });
                        });
                        pastedTabs = [];
                        sourceWindow = undefined;
                }
                return true;
            }
        }
    };
}();

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded");
});

chrome.commands.onCommand.addListener(function(command) {
    console.log('command listener:', command);
    switch(command) {
        /*case CMD_CUT:
        case CMD_COPY:
            app.setPendingCommand(command);
            chrome.windows.getLastFocused({}, function (window) {
                console.log("last focused window:", window);
                app.setSourceWindow(window);
                chrome.tabs.query({highlighted: true, windowId: window.id}, app.setSelectedTabs);
            });
            break;
        case CMD_DUP:
            app.setPendingCommand(command);
            chrome.windows.getLastFocused({}, function (window) {
                console.log("duplication window:", window);
                app.setSourceWindow(window);
                chrome.tabs.query({highlighted: true, windowId: window.id}, function(tabs){
                    app.setSelectedTabs(tabs);
                    app.pasteTabs(undefined, tabs, CMD_COPY);
                });
            });
            break;
        case CMD_PASTE:
            chrome.windows.getLastFocused({}, function (window) {
                console.log("last focused window:", window);
                app.pasteTabs(window, app.getSelectedTabs(), app.getPendingCommand());
            });
            break;*/
        case CMD_UNDO:
            if(app.undoLastCommand()) { 
                console.log("undo successful");
            } else console.log("undo failed");
            break;
        case CMD_CUT:
        case CMD_MOVE_NEXT:
        case CMD_MOVE_PREV:
            app.setPendingCommand(command);
            chrome.windows.getLastFocused({}, function (window) {
                console.log("move from window:", window);
                app.setSourceWindow(window);
                chrome.tabs.query({highlighted: true, windowId: window.id}, function(tabs){
                    app.setSelectedTabs(tabs);
                    chrome.windows.getAll({windowTypes: ['normal']}, function (windows){
                        if(windows.length == 1 || command == CMD_CUT) {
                            var tabA = tabs[0];
                            chrome.windows.create({tabId: tabA.id}, 
                                function (nWindow){
                                    app.pasteTabs(nWindow, tabs, CMD_CUT);
                                });
                        } else {
                            var idx = 0;
                            do {
                                if(windows[idx].id == window.id) {
                                    idx += (command == CMD_MOVE_NEXT ? 1 : -1);
                                    break;
                                }
                            } while(++idx < windows.length);
                            if(idx == windows.length) idx = 0;
                            else if(idx < 0) idx = windows.length - 1;
                            var nWindow = windows[idx];
                            app.pasteTabs(nWindow, tabs, CMD_CUT);
                        }
                    });
                });
            });
            break;
    }
});