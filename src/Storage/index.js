class Storage {

  constructor() {
    this.splitKey = ',';
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
    return this.storage.get(`${this.mapPrefix}${key}`).then((result) => result[`${this.mapPrefix}${key}`]);
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

  clear() {
    return this.storage.clear();
  }
}

export default new Storage();
