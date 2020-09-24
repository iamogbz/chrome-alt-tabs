interface AnyObject {
    [key: string]: any;
}

type ChromeTab = chrome.tabs.Tab;
type ChromeWindow = chrome.windows.Window & AnyObject;

interface Action {
    type: string;
    payload?: AnyObject;
}

type ActionHandler = (action: Action) => Promise<boolean>;

declare module "*.html";
