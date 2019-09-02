import Preference from './Preference';

export default class BooleanPreference extends Preference {

  get() {
    return this.el.checked;
  }

  set(value) {
    this.el.checked = value;
  }
}

BooleanPreference.TYPE = 'bool';
