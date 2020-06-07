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
    console.info('bifulushi: Removed temporary container ID:', tabContextId);
    return ContextualIdentities.remove(tabContextId);
  }
}


export function cleanUpTemporaryContainers() {
  Promise.all([
    browser.contextualIdentities.query({}),
    browser.tabs.query({}),
    PreferenceStorage.getAll(true),
  ]).then(([containers, tabs, preferences]) => {
    preferences = filterByKey(preferences, key => key.startsWith('containers.'));

    const cookieStoreIds = {};
    // Containers with open tabs
    const activeCookieStoreIds = tabs.reduce((acc, tab) => {
      let cookieTabs = acc[tab.cookieStoreId] || [];
      cookieTabs.push(tab);
      acc[tab.cookieStoreId] = cookieTabs;
      return acc;
    }, {});
    // Get rid of existing leftover temporary containers
    // Leftover means without open tabs
    let promises = containers.filter((container) => {
      const cookieStoreId = container.cookieStoreId;
      cookieStoreIds[cookieStoreId] = true;
      return activeCookieStoreIds[cookieStoreId] === undefined // inactive containers
              && preferences[`containers.${cookieStoreId}.lifetime`] === 'untilLastTab';
    }).map((container) => {
      console.warn('Removing leftover container: ', container.name);
      return ContextualIdentities.remove(container.cookieStoreId);
    });

    // Get rid of leftover/orphaned container preferences
    const leftoverPreferences = Object.keys(preferences).filter(prefName => {
      // eslint-disable-next-line no-unused-vars
      const [prefix, cookieStoreId, ...rest] = prefName.split('.');
      return !cookieStoreIds[cookieStoreId];
    });

    if (leftoverPreferences.length > 0) {
      console.warn('Removing leftover preferences', leftoverPreferences);
      promises.push(PreferenceStorage.remove(leftoverPreferences).then(() => {
        console.warn('Removed leftover preferences');
      }).catch(console.error));
    }
    return Promise.all(promises).then(() => {
      browser.storage.local.get().then(console.debug);
    });
  });
}
