import './manifest.json';
import {webRequestListener} from './webRequestListener';

browser.webRequest.onBeforeRequest.addListener(
  webRequestListener,
  {urls: ['<all_urls>'], types: ['main_frame']},
  ['blocking'],
);
