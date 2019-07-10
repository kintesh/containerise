import {matchesSavedMap, sortMaps} from '../utils';
import PrefixStorage from './PrefixStorage';

class Storage extends PrefixStorage{
  PREFIX = 'map='

  get(url) {
    return super.getAll().then(maps => {
      const sorted = sortMaps(Object.keys(maps).map(key => maps[key]));
      // Sorts by domain length, then by path length
      return sorted.find(matchesSavedMap.bind(null, url)) || {};
    });
 }

}

export default new Storage();
