import './manifest.json';
import '../static/icons/icon.png';
import {tabUpdatedListener, webRequestListener} from './containers';
import {messageExternalListener} from './messageExternalListener';

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
