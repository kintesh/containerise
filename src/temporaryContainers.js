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

    const cookieStoreIds = {};
    // Get rid of existing leftover temporary containers
    let promises = containers.filter((container) => {
      cookieStoreIds[container.cookieStoreId] = true;
      return preferences[`containers.${container.cookieStoreId}.lifetime`] === 'untilLastTab';
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
        console.war('Removed leftover preferences');
      }).catch(console.error));
    }
    return Promise.all(promises).then(() => {
      browser.storage.get().then(console.log);
    });
  });
}
