import Storage from './Storage/index';
import ContextualIdentity from './ContextualIdentity';
import Tabs from './Tabs';

const createTab = (url, newTabIndex, currentTabId, cookieStoreId) => {

  Tabs.get(currentTabId).then((currentTab) => {
    Tabs.create({
      url,
      index: newTabIndex,
      cookieStoreId,
      active: currentTab.active,
    });

    if (cookieStoreId !== undefined) {
      Tabs.remove(currentTabId);
    }
  });

  return {
    cancel: true,
  };
};

export const webRequestListener = (requestDetails) => {

  if (requestDetails.frameId !== 0 || requestDetails.tabId === -1) {
    return {};
  }

  return Promise.all([
    Storage.get(requestDetails.url),
    ContextualIdentity.getAll(),
    Tabs.get(requestDetails.tabId),
  ]).then(([hostMap, identities, currentTab]) => {

    if (currentTab.incognito || !hostMap) {
      return {};
    }

    const hostIdentity = identities.find((identity) => identity.cookieStoreId === hostMap.cookieStoreId);
    const tabIdentity = identities.find((identity) => identity.cookieStoreId === currentTab.cookieStoreId);

    if (hostIdentity && hostIdentity.cookieStoreId !== currentTab.cookieStoreId) {
      return createTab(requestDetails.url, currentTab.index + 1, currentTab.id, hostIdentity.cookieStoreId); 
    }

    if (!hostIdentity && tabIdentity) {
      return createTab(requestDetails.url, currentTab.index + 1, currentTab.id);
    }

    return {};
  });

};
