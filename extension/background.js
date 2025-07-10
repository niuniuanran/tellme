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
  // Must call sidePanel.open() immediately to preserve user gesture
  chrome.sidePanel.open({ tabId: tab.id });

  // Handle storage operations asynchronously after opening side panel
  (async () => {
    // Always set context first
    await chrome.storage.session.set({ context: data.selectionText });

    if (data.menuItemId === "tell-me-right-away") {
      // Set flag to auto-execute when side panel opens, with timestamp for freshness
      await chrome.storage.session.set({
        autoExecute: true,
        timestamp: Date.now(),
      });
    } else {
      // Make sure autoExecute is cleared for regular "Tell me..." option
      await chrome.storage.session.remove("autoExecute");
    }
  })();
});
