import PrefixStorage from './PrefixStorage';

class PreferenceStorage extends PrefixStorage {
  constructor() {
    super();
    this.PREFIX = 'pref=';
  }

  // TODO: Add `valuesOnly` param to getAll and get methods
}

export default new PreferenceStorage();
