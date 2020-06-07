import {matchesSavedMap, sortMaps} from '../utils';
import PrefixStorage from './PrefixStorage';

class HostStorage extends PrefixStorage {
  constructor() {
    super();
    this.PREFIX = 'map=';
    this.SET_KEY = 'host';
  }

  get(url, preferences={}) {
    return super.getAll().then(maps => {
      const sorted = sortMaps(Object.keys(maps).map(key => maps[key]));
      // Sorts by domain length, then by path length
      return sorted.find((map) => {
        try{
          return matchesSavedMap( url, preferences, map);
        } catch (e) {
          console.error('Error matching maps', map, url, preferences, e);
          return false;
        }
      }) || {};
    });
  }

}

export default new HostStorage();
