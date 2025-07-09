function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'tell-me',
    title: 'Tell me ...',
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  chrome.storage.session.set({ context: data.selectionText });
  chrome.sidePanel.open({ tabId: tab.id });
});
