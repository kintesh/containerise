// Hoisted and adapted from https://gitlab.com/NamingThingsIsHard/firefox/click-to-contain

import PreferenceStorage from './Storage/PreferenceStorage';

// Prefer tracking tabs and their contexts to
// calling browser.tabs.query with the contextId
// It's lighter and faster
let tabContexts = {};

function countTabsInContext(contextId) {
  if (!contextId) {
    throw 'Must provide contextId';
  }
  return Object.keys(tabContexts).filter((tabId) => tabContexts[tabId] === contextId).length;
}

/**
 * Keep track of the tabs in the contexts we own
 * @param tab {Tab}
 */
export function onTabCreated(tab) {
  tabContexts[tab.id] = tab.cookieStoreId;
}

/**
 * Deletes temporary containers
 *
 * @param tabId {int|String}
 */
export async function onTabRemoved(tabId) {
  let tabContextId = tabContexts[tabId];
  if (!tabContextId) {
    return;
  }
  delete tabContexts[tabId];
  if (countTabsInContext(tabContextId) > 0) {
    return;
  }
  const contextLifetime = await PreferenceStorage.get(
      `containers.${tabContextId}.lifetime`,
      true
  );
  if (contextLifetime === 'untilLastTab') {
    console.info('containerise: Removed temporary container ID:', tabContextId);
    browser.contextualIdentities.remove(tabContextId);
  }
}
