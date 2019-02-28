type Tab = chrome.tabs.Tab;
type Window = chrome.windows.Window;
type AnyObject = { [key: string]: any };

export interface Action {
    type: string;
    payload?: AnyObject;
}

type ActionHandler = (action: Action) => Promise<boolean>
