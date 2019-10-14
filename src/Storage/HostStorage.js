import {matchesSavedMap, sortMaps} from '../utils';
import PrefixStorage from './PrefixStorage';

class HostStorage extends PrefixStorage {
  constructor() {
    super();
    this.PREFIX = 'map=';
    this.SET_KEY = 'host';
  }

  get(url, matchDomainOnly) {
    return super.getAll().then(maps => {
      const sorted = sortMaps(Object.keys(maps).map(key => maps[key]));
      // Sorts by domain length, then by path length
      return sorted.find(matchesSavedMap.bind(null, url, matchDomainOnly)) || {};
    });
  }

}

export default new HostStorage();
