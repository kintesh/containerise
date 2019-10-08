import PrefixStorage from './PrefixStorage';

class PreferenceStorage extends PrefixStorage {
  constructor() {
    super();
    this.PREFIX = 'pref=';
  }

  async getAll(valuesOnly = false) {
    let preferences = await super.getAll();
    if (valuesOnly) {
      for (let preferenceKey in preferences) {
        preferences[preferenceKey] = preferences[preferenceKey].value;
      }
    }
    return preferences;
  }

  async get(key, valueOnly = false) {
    let preference = await super.get(key);
    if (valueOnly && preference !== undefined) {
      preference = preference.value;
    }
    return preference;
  }
}

export default new PreferenceStorage();
