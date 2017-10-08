import Storage from './Storage/index';
import ContextualIdentity from './ContextualIdentity';
import Tabs from './Tabs';

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
  ]).then(([hostMap, identities, currentTab]) => {

    if (currentTab.incognito || !hostMap) {
      return {};
    }

    const identity = identities.find((identity) => identity.cookieStoreId === hostMap.cookieStoreId);

    if (!identity || currentTab.cookieStoreId === identity.cookieStoreId) {
      return {};
    }

    Tabs.create({
      url: requestDetails.url,
      cookieStoreId: identity.cookieStoreId,
      index: currentTab.index + 1,
    });

    Tabs.remove(currentTab.id);

    return {
      cancel: true,
    };
  });

};
