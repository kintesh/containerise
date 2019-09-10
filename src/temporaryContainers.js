// Hoisted and adapted from https://gitlab.com/NamingThingsIsHard/firefox/click-to-contain

import ContextualIdentities from './ContextualIdentity';
import PreferenceStorage from './Storage/PreferenceStorage';
import {filterByKey} from './utils';

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
    return ContextualIdentities.remove(tabContextId);
  }
}


export function cleanUpTemporaryContainers() {
  Promise.all([
    browser.contextualIdentities.query({}),
    PreferenceStorage.getAll(true),
  ]).then(([containers, preferences]) => {
    preferences = filterByKey(preferences, key => key.startsWith('containers.'));

    containers.filter((container) => {
      return preferences[`containers.${container.cookieStoreId}.lifetime`] === 'untilLastTab';
    }).forEach((container) => {
      console.info('Removing leftover container: ', container.name);
      ContextualIdentities.remove(container.cookieStoreId);
    });
  });
}
