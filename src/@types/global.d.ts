type ChromeTab = chrome.tabs.Tab;
type ChromeWindow = chrome.windows.Window;

interface Action {
  type: string;
  payload?: unknown;
}

interface MoveTabAction extends Action {
  payload: {
    from?: number;
    tabs: ChromeTab[];
    to?: number;
  };
}

type ActionHandler = (action: Action) => Promise<boolean>;

declare module "*.html";
