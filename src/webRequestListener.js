import Storage from './Storage/index';
import ContextualIdentity from './ContextualIdentity';
import Tabs from './Tabs';

const createTab = (url, newTabIndex, currentTabId, cookieStoreId) => {
  Tabs.create({
    url,
    index: newTabIndex,
    cookieStoreId,
  });

  Tabs.remove(currentTabId);

  return {
    cancel: true,
  };
};

export const webRequestListener = (requestDetails) => {

  if (requestDetails.frameId !== 0 || requestDetails.tabId === -1) {
    return {};
  }

  const url = new window.URL(requestDetails.url);
  const hostname = url.hostname.replace('www.', '');

  return Promise.all([
    Storage.get(hostname),
    ContextualIdentity.getAll(),
    Tabs.get(requestDetails.tabId),
    Storage.get('default'),
  ]).then(([hostMap, identities, currentTab, defaultContainer]) => {

    if (currentTab.incognito || !hostMap) {
      return {};
    }

    const hostIdentity = identities.find((identity) => identity.cookieStoreId === hostMap.cookieStoreId);
    const defaultIdentity = identities.find((identity) => identity.cookieStoreId === defaultContainer.cookieStoreId);

    let newContainer;

    if (!hostIdentity && defaultIdentity && currentTab.cookieStoreId !== defaultContainer.cookieStoreId) {
      newContainer = defaultContainer.cookieStoreId;
    } else if (hostIdentity && hostIdentity.cookieStoreId !== currentTab.cookieStoreId) {
      newContainer = hostIdentity.cookieStoreId;
    }

    return !newContainer ? {} : createTab(requestDetails.url, currentTab.index + 1, currentTab.id, newContainer);
  });

};
