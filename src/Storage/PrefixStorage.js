export default class PrefixStorage {

  constructor() {
    this.PREFIX = '';
    this.storage = browser.storage.local;
    this.listeners = new Map();
  }

  /**
   * Get all keys that have the prefix.
   *
   * The prefix isn't returns in the keys!
   *
   * @return {Promise<Object> | PromiseLike<Object>}
   */
  getAll() {
    return this.storage.get(null).then((results) => {
      return this._getNonPrefixedObject(results);
    });

  }

  _getNonPrefixedObject(prefixedObject){
    return Object
          .keys(prefixedObject)
          .filter((key) => key.startsWith(this.PREFIX))
          .reduce((newObject, key) => {
            newObject[
                key.replace(this.PREFIX, '')
                ] = prefixedObject[key];
            return newObject;
          }, {});
  }

  get(key) {
    return this.storage.get(this.PREFIX + key);
  }

  setAll(obj = {}) {
    const prefixedObj = {};
    for (const key in obj) {
      prefixedObj[`${this.PREFIX}${key}`] = obj[key];
    }
    return this.storage.set(prefixedObj);
  }

  set(obj = {}) {
    return this.storage.set(`${this.PREFIX}${obj.host}`, obj);
  }

  /**
   *
   * @param keys {String | String[]}
   */
  remove(keys) {
    keys = Array.isArray(keys) ? keys : [keys];
    return this.storage.remove(keys.map( key => `${this.PREFIX}${key}`));
  }

  /**
   * Removes all keys with our prefix
   */
  async clear() {
    const results = await this.getAll();
    await this.remove(Object.keys(results));
  }

  /**
   * Only triggers when an object with our prefix has been changed
   * @param fn {Function<Object, String>}
   */
  addOnChangedListener(fn) {
    if(fn in this.listeners){
      return;
    }
    const listener = (changes, area) => {
      let prefixChanges = this._getNonPrefixedObject(changes);
      if(!prefixChanges){
        return;
      }
      fn(prefixChanges, area);
    };
    this.listeners[fn]=listener;
    browser.storage.onChanged.addListener(listener);
  }

}
