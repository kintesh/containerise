import Storage from './Storage/HostStorage';
import ContextualIdentity, {NO_CONTAINER} from './ContextualIdentity';
import Tabs from './Tabs';
import PreferenceStorage from './Storage/PreferenceStorage';

const createTab = (url, newTabIndex, currentTabId, cookieStoreId, openerTabId) => {
  Tabs.get(currentTabId).then((currentTab) => {
    Tabs.create({
      url,
      index: newTabIndex,
      cookieStoreId,
      active: currentTab.active,
      openerTabId: openerTabId,
    });
    PreferenceStorage.get('keepOldTabs').then(({value}) => {
      if(!value){
        Tabs.remove(currentTabId);
      }
    }).catch(() => {
      Tabs.remove(currentTabId);
    });

  });

  return {
    cancel: true,
  };
};

function handle(url, tabId) {
  return Promise.all([
    Storage.get(url),
    ContextualIdentity.getAll(),
    Tabs.get(tabId),
  ]).then(([hostMap, identities, currentTab]) => {

    if (currentTab.incognito || !hostMap) {
      return {};
    }

    const hostIdentity = identities.find((identity) => identity.cookieStoreId === hostMap.cookieStoreId);
    const tabIdentity = identities.find((identity) => identity.cookieStoreId === currentTab.cookieStoreId);

    if (!hostIdentity) {
      return {};
    }

    const openerTabId = currentTab.openerTabId;
    if (hostIdentity.cookieStoreId === NO_CONTAINER.cookieStoreId && tabIdentity) {
      return createTab(url, currentTab.index + 1, currentTab.id, undefined , openerTabId);
    }

    if (hostIdentity.cookieStoreId !== currentTab.cookieStoreId && hostIdentity.cookieStoreId !== NO_CONTAINER.cookieStoreId) {
      return createTab(url, currentTab.index + 1, currentTab.id, hostIdentity.cookieStoreId, openerTabId);
    }

    return {};
  });
}

export const webRequestListener = (requestDetails) => {

  if (requestDetails.frameId !== 0 || requestDetails.tabId === -1) {
    return {};
  }

  return handle(requestDetails.url, requestDetails.tabId);
};

export const tabUpdatedListener = (tabId, changeInfo) => {
  if (!changeInfo.url) {
    return;
  }
  return handle(changeInfo.url, tabId);
};
