function setupContextMenu() {
  chrome.contextMenus.create({
    id: "tell-me",
    title: "Tell me ...",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "tell-me-right-away",
    title: "Tell me right away",
    contexts: ["selection"],
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  chrome.storage.session.set({ context: data.selectionText });

  if (data.menuItemId === "tell-me-right-away") {
    // Set flag to auto-execute when side panel opens
    chrome.storage.session.set({ autoExecute: true });
  }

  chrome.sidePanel.open({ tabId: tab.id });
});
