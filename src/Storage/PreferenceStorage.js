import PrefixStorage from './PrefixStorage';

class PreferenceStorage extends PrefixStorage {
  constructor() {
    super();
    this.PREFIX = 'pref=';
  }

}

export default new PreferenceStorage();
