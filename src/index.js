import './manifest.json';
import {tabUpdatedListener, webRequestListener} from './containers';
import {messageExternalListener} from './messageExternalListener';
import {onTabCreated, onTabRemoved} from './temporaryContainers';

browser.webRequest.onBeforeRequest.addListener(
  webRequestListener,
  {urls: ['<all_urls>'], types: ['main_frame']},
  ['blocking'],
);

browser.runtime.onMessageExternal.addListener(
  messageExternalListener
);

browser.tabs.onUpdated.addListener(
    tabUpdatedListener
);

browser.tabs.onCreated.addListener(onTabCreated);
browser.tabs.onRemoved.addListener(onTabRemoved);
