import {domainMatch, pathMatch, sortMaps} from '../utils';

class Storage {

  constructor() {
    this.mapPrefix = 'map=';
    this.storage = browser.storage.local;
  }

  getAll() {
    return this.storage.get(null).then((results) => {
        const hostMaps = {};
        for (const key in results) {
          const map = results[key];
          hostMaps[map.host.replace(this.mapPrefix, '')] = map;
        }
        return hostMaps;
      });
  }

  get(key) {
    return this.getAll().then(maps => {
      const sorted = sortMaps(Object.keys(maps).map(key => maps[key]));
      // Sorts by domain length, then by path length
      for (const map of sorted) {
        const url = (key.indexOf('/') === -1) ? key.concat('/') : key;
        const mapHost = (map.host.indexOf('/') === -1) ? map.host.concat('/') : map.host;
        if (domainMatch(url, mapHost) && pathMatch(url, mapHost)) {
          return map;
        }
      }
      return {};
    });
 }

  setAll(obj = {}) {
    const prefixedObj = {};
    for (const key in obj) {
      prefixedObj[`${this.mapPrefix}${key}`] = obj[key];
    }
    return this.storage.set(prefixedObj);
  }

  set(obj = {}) {
    return this.storage.set(`${this.mapPrefix}${obj.host}`, obj);
  }

  remove(key) {
    return this.storage.remove(`${this.mapPrefix}${key}`);
  }

  clear() {
    return this.storage.clear();
  }

  addOnChangedListener(fn) {
    browser.storage.onChanged.addListener(fn);
  }

}

export default new Storage();
