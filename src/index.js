import './manifest.json';
import {webRequestListener} from './webRequestListener';
import {messageExternalListener} from './messageExternalListener';

browser.webRequest.onBeforeRequest.addListener(
  webRequestListener,
  {urls: ['<all_urls>'], types: ['main_frame']},
  ['blocking'],
);

browser.runtime.onMessageExternal.addListener(
  messageExternalListener
);
