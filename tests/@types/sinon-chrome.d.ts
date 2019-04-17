export const accessibilityFeatures: {
    animationPolicy: any;
    autoclick: any;
    caretHighlight: any;
    cursorHighlight: any;
    focusHighlight: any;
    highContrast: any;
    largeCursor: any;
    screenMagnifier: any;
    selectToSpeak: any;
    spokenFeedback: any;
    stickyKeys: any;
    switchAccess: any;
    virtualKeyboard: any;
};
export const alarms: {
    clear: any;
    clearAll: any;
    create: any;
    get: any;
    getAll: any;
    onAlarm: any;
};
export const bookmarks: {
    MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE: any;
    MAX_WRITE_OPERATIONS_PER_HOUR: any;
    create: any;
    export: any;
    get: any;
    getChildren: any;
    getRecent: any;
    getSubTree: any;
    getTree: any;
    import: any;
    move: any;
    onChanged: any;
    onChildrenReordered: any;
    onCreated: any;
    onImportBegan: any;
    onImportEnded: any;
    onMoved: any;
    onRemoved: any;
    remove: any;
    removeTree: any;
    search: any;
    update: any;
};
export const browserAction: {
    disable: any;
    enable: any;
    getBadgeBackgroundColor: any;
    getBadgeText: any;
    getPopup: any;
    getTitle: any;
    onClicked: any;
    openPopup: any;
    setBadgeBackgroundColor: any;
    setBadgeText: any;
    setIcon: any;
    setPopup: any;
    setTitle: any;
};
export const browsingData: {
    remove: any;
    removeAppcache: any;
    removeCache: any;
    removeCookies: any;
    removeDownloads: any;
    removeFileSystems: any;
    removeFormData: any;
    removeHistory: any;
    removeIndexedDB: any;
    removeLocalStorage: any;
    removePasswords: any;
    removePluginData: any;
    removeWebSQL: any;
    settings: any;
};
export const certificateProvider: {
    onCertificatesRequested: any;
    onSignDigestRequested: any;
};
export const commands: {
    getAll: any;
    onCommand: any;
};
export const contentSettings: {
    automaticDownloads: any;
    camera: any;
    cookies: any;
    fullscreen: any;
    images: any;
    javascript: any;
    location: any;
    microphone: any;
    mouselock: any;
    notifications: any;
    plugins: any;
    popups: any;
    unsandboxedPlugins: any;
};
export const contextMenus: {
    ACTION_MENU_TOP_LEVEL_LIMIT: any;
    create: any;
    onClicked: any;
    remove: any;
    removeAll: any;
    update: any;
};
export const cookies: {
    get: any;
    getAll: any;
    getAllCookieStores: any;
    onChanged: any;
    remove: any;
    set: any;
};
export const declarativeContent: {
    onPageChanged: any;
};
export const desktopCapture: {
    cancelChooseDesktopMedia: any;
    chooseDesktopMedia: any;
};
export const devtools: {
    inspectedWindow: {
        getResources: any;
        onResourceAdded: any;
        onResourceContentCommitted: any;
        reload: any;
        tabId: any;
    };
    network: {
        getHAR: any;
        onNavigated: any;
        onRequestFinished: any;
    };
    panels: {
        create: any;
        elements: any;
        openResource: any;
        setOpenResourceHandler: any;
        sources: any;
    };
};
export const dial: {
    discoverNow: any;
    fetchDeviceDescription: any;
    onDeviceList: any;
    onError: any;
};
export const documentScan: {
    scan: any;
};
export const downloads: {
    acceptDanger: any;
    cancel: any;
    download: any;
    drag: any;
    erase: any;
    getFileIcon: any;
    onChanged: any;
    onCreated: any;
    onDeterminingFilename: any;
    onErased: any;
    open: any;
    pause: any;
    removeFile: any;
    resume: any;
    search: any;
    setShelfEnabled: any;
    show: any;
    showDefaultFolder: any;
};
export const enterprise: {
    deviceAttributes: {
        getDirectoryDeviceId: any;
    };
    platformKeys: {
        challengeMachineKey: any;
        challengeUserKey: any;
        getCertificates: any;
        getTokens: any;
        importCertificate: any;
        removeCertificate: any;
    };
};
export const events: {};
export const extension: {
    getBackgroundPage: any;
    getExtensionTabs: any;
    getURL: any;
    getViews: any;
    inIncognitoContext: any;
    isAllowedFileSchemeAccess: any;
    isAllowedIncognitoAccess: any;
    lastError: any;
    onRequest: any;
    onRequestExternal: any;
    sendRequest: any;
    setUpdateUrlData: any;
};
export const extensionTypes: {};
export const fileBrowserHandler: {
    onExecute: any;
    selectFile: any;
};
export const fileSystemProvider: {
    get: any;
    getAll: any;
    mount: any;
    notify: any;
    onAbortRequested: any;
    onAddWatcherRequested: any;
    onCloseFileRequested: any;
    onConfigureRequested: any;
    onCopyEntryRequested: any;
    onCreateDirectoryRequested: any;
    onCreateFileRequested: any;
    onDeleteEntryRequested: any;
    onExecuteActionRequested: any;
    onGetActionsRequested: any;
    onGetMetadataRequested: any;
    onMountRequested: any;
    onMoveEntryRequested: any;
    onOpenFileRequested: any;
    onReadDirectoryRequested: any;
    onReadFileRequested: any;
    onRemoveWatcherRequested: any;
    onTruncateRequested: any;
    onUnmountRequested: any;
    onWriteFileRequested: any;
    unmount: any;
};
export function flush(): void;
export const fontSettings: {
    clearDefaultFixedFontSize: any;
    clearDefaultFontSize: any;
    clearFont: any;
    clearMinimumFontSize: any;
    getDefaultFixedFontSize: any;
    getDefaultFontSize: any;
    getFont: any;
    getFontList: any;
    getMinimumFontSize: any;
    onDefaultFixedFontSizeChanged: any;
    onDefaultFontSizeChanged: any;
    onFontChanged: any;
    onMinimumFontSizeChanged: any;
    setDefaultFixedFontSize: any;
    setDefaultFontSize: any;
    setFont: any;
    setMinimumFontSize: any;
};
export const gcm: {
    MAX_MESSAGE_SIZE: any;
    onMessage: any;
    onMessagesDeleted: any;
    onSendError: any;
    register: any;
    send: any;
    unregister: any;
};
export const history: {
    addUrl: any;
    deleteAll: any;
    deleteRange: any;
    deleteUrl: any;
    getVisits: any;
    onVisitRemoved: any;
    onVisited: any;
    search: any;
};
export const i18n: {
    detectLanguage: any;
    getAcceptLanguages: any;
    getMessage: any;
    getUILanguage: any;
};
export const identity: {
    getAccounts: any;
    getAuthToken: any;
    getProfileUserInfo: any;
    getRedirectURL: any;
    launchWebAuthFlow: any;
    onSignInChanged: any;
    removeCachedAuthToken: any;
};
export const idle: {
    onStateChanged: any;
    queryState: any;
    setDetectionInterval: any;
};
export const input: {
    ime: {
        activate: any;
        clearComposition: any;
        commitText: any;
        createWindow: any;
        deactivate: any;
        deleteSurroundingText: any;
        hideInputView: any;
        hideWindow: any;
        keyEventHandled: any;
        onActivate: any;
        onBlur: any;
        onCandidateClicked: any;
        onCompositionBoundsChanged: any;
        onDeactivated: any;
        onFocus: any;
        onInputContextUpdate: any;
        onKeyEvent: any;
        onMenuItemActivated: any;
        onReset: any;
        onSurroundingTextChanged: any;
        sendKeyEvents: any;
        setCandidateWindowProperties: any;
        setCandidates: any;
        setComposition: any;
        setCursorPosition: any;
        setMenuItems: any;
        showWindow: any;
        updateMenuItems: any;
    };
};
export const instanceID: {
    deleteID: any;
    deleteToken: any;
    getCreationTime: any;
    getID: any;
    getToken: any;
    onTokenRefresh: any;
};
export const management: {
    createAppShortcut: any;
    generateAppForLink: any;
    get: any;
    getAll: any;
    getPermissionWarningsById: any;
    getPermissionWarningsByManifest: any;
    getSelf: any;
    launchApp: any;
    onDisabled: any;
    onEnabled: any;
    onInstalled: any;
    onUninstalled: any;
    setEnabled: any;
    setLaunchType: any;
    uninstall: any;
    uninstallSelf: any;
};
export const networking: {
    config: {
        finishAuthentication: any;
        onCaptivePortalDetected: any;
        setNetworkFilter: any;
    };
};
export const notifications: {
    clear: any;
    create: any;
    getAll: any;
    getPermissionLevel: any;
    onButtonClicked: any;
    onClicked: any;
    onClosed: any;
    onPermissionLevelChanged: any;
    onShowSettings: any;
    update: any;
};
export const omnibox: {
    onInputCancelled: any;
    onInputChanged: any;
    onInputEntered: any;
    onInputStarted: any;
    sendSuggestions: any;
    setDefaultSuggestion: any;
};
export const pageAction: {
    getPopup: any;
    getTitle: any;
    hide: any;
    onClicked: any;
    setIcon: any;
    setPopup: any;
    setTitle: any;
    show: any;
};
export const pageCapture: {
    saveAsMHTML: any;
};
export const permissions: {
    contains: any;
    getAll: any;
    onAdded: any;
    onRemoved: any;
    remove: any;
    request: any;
};
export const platformKeys: {
    getKeyPair: any;
    selectClientCertificates: any;
    subtleCrypto: any;
    verifyTLSServerCertificate: any;
};
export namespace plugins {
    class CookiePlugin {
        constructor(...args: any[]);
        onChanged: any;
        get(details: any, callback: any, ...args: any[]): any;
        getAll(details: any, callback: any, ...args: any[]): any;
        install(chrome: any): void;
        remove(details: any, callback: any, ...args: any[]): void;
        set(details: any, callback: any, ...args: any[]): void;
    }
    class I18nPlugin {
        constructor(...args: any[]);
        detectLanguage(...args: any[]): void;
        getAcceptLanguages(...args: any[]): void;
        getMessage(messageName: any, ...args: any[]): any;
        getUILanguage(): any;
        install(chrome: any): void;
    }
}
export const power: {
    releaseKeepAwake: any;
    requestKeepAwake: any;
};
export const printerProvider: {
    onGetCapabilityRequested: any;
    onGetPrintersRequested: any;
    onGetUsbPrinterInfoRequested: any;
    onPrintRequested: any;
};
export const privacy: {
    network: {
        networkPredictionEnabled: any;
        webRTCIPHandlingPolicy: any;
        webRTCMultipleRoutesEnabled: any;
        webRTCNonProxiedUdpEnabled: any;
    };
    services: {
        alternateErrorPagesEnabled: any;
        autofillEnabled: any;
        hotwordSearchEnabled: any;
        passwordSavingEnabled: any;
        safeBrowsingEnabled: any;
        safeBrowsingExtendedReportingEnabled: any;
        searchSuggestEnabled: any;
        spellingServiceEnabled: any;
        translationServiceEnabled: any;
    };
    websites: {
        hyperlinkAuditingEnabled: any;
        protectedContentEnabled: any;
        referrersEnabled: any;
        thirdPartyCookiesAllowed: any;
    };
};
export const proxy: {
    onProxyError: any;
    settings: any;
};
export function registerPlugin(plugin: any): void;
export function reset(): void;
export const runtime: {
    connect: any;
    connectNative: any;
    getBackgroundPage: any;
    getManifest: any;
    getPackageDirectoryEntry: any;
    getPlatformInfo: any;
    getURL: any;
    id: any;
    lastError: any;
    onBrowserUpdateAvailable: any;
    onConnect: any;
    onConnectExternal: any;
    onInstalled: any;
    onMessage: any;
    onMessageExternal: any;
    onRestartRequired: any;
    onStartup: any;
    onSuspend: any;
    onSuspendCanceled: any;
    onUpdateAvailable: any;
    openOptionsPage: any;
    reload: any;
    requestUpdateCheck: any;
    restart: any;
    restartAfterDelay: any;
    sendMessage: any;
    sendNativeMessage: any;
    setUninstallURL: any;
};
export const sessions: {
    MAX_SESSION_RESULTS: any;
    getDevices: any;
    getRecentlyClosed: any;
    onChanged: any;
    restore: any;
};
export const storage: {
    local: any;
    managed: any;
    onChanged: any;
    sync: any;
};
export const system: {
    cpu: {
        getInfo: any;
    };
    memory: {
        getInfo: any;
    };
    storage: {
        ejectDevice: any;
        getAvailableCapacity: any;
        getInfo: any;
        onAttached: any;
        onDetached: any;
    };
};
export const tabCapture: {
    capture: any;
    captureOffscreenTab: any;
    getCapturedTabs: any;
    onStatusChanged: any;
};
export const tabs: {
    TAB_ID_NONE: any;
    captureVisibleTab: any;
    connect: any;
    create: any;
    detectLanguage: any;
    discard: any;
    duplicate: any;
    executeScript: any;
    get: any;
    getAllInWindow: any;
    getCurrent: any;
    getSelected: any;
    getZoom: any;
    getZoomSettings: any;
    highlight: any;
    insertCSS: any;
    move: any;
    onActivated: any;
    onActiveChanged: any;
    onAttached: any;
    onCreated: any;
    onDetached: any;
    onHighlightChanged: any;
    onHighlighted: any;
    onMoved: any;
    onRemoved: any;
    onReplaced: any;
    onSelectionChanged: any;
    onUpdated: any;
    onZoomChange: any;
    query: any;
    reload: any;
    remove: any;
    sendMessage: any;
    sendRequest: any;
    setZoom: any;
    setZoomSettings: any;
    update: any;
};
export const topSites: {
    get: any;
};
export const tts: {
    getVoices: any;
    isSpeaking: any;
    onEvent: any;
    pause: any;
    resume: any;
    speak: any;
    stop: any;
};
export const ttsEngine: {
    onPause: any;
    onResume: any;
    onSpeak: any;
    onStop: any;
    sendTtsEvent: any;
};
export const types: {};
export const vpnProvider: {
    createConfig: any;
    destroyConfig: any;
    notifyConnectionStateChanged: any;
    onConfigCreated: any;
    onConfigRemoved: any;
    onPacketReceived: any;
    onPlatformMessage: any;
    onUIEvent: any;
    sendPacket: any;
    setParameters: any;
};
export const wallpaper: {
    setWallpaper: any;
};
export const webNavigation: {
    getAllFrames: any;
    getFrame: any;
    onBeforeNavigate: any;
    onCommitted: any;
    onCompleted: any;
    onCreatedNavigationTarget: any;
    onDOMContentLoaded: any;
    onErrorOccurred: any;
    onHistoryStateUpdated: any;
    onReferenceFragmentUpdated: any;
    onTabReplaced: any;
};
export const webRequest: {
    MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: any;
    handlerBehaviorChanged: any;
    onAuthRequired: any;
    onBeforeRedirect: any;
    onBeforeRequest: any;
    onBeforeSendHeaders: any;
    onCompleted: any;
    onErrorOccurred: any;
    onHeadersReceived: any;
    onResponseStarted: any;
    onSendHeaders: any;
};
export const webstore: {
    install: any;
    onDownloadProgress: any;
    onInstallStageChanged: any;
};
export const windows: {
    WINDOW_ID_CURRENT: any;
    WINDOW_ID_NONE: any;
    create: any;
    get: any;
    getAll: any;
    getCurrent: any;
    getLastFocused: any;
    onCreated: any;
    onFocusChanged: any;
    onRemoved: any;
    remove: any;
    update: any;
};
