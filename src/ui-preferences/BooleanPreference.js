import Preference from './Preference';

export default class BooleanPreference extends Preference {

  _buildEl() {
    let el = super._buildEl();
    el.type = 'checkbox';
    return el;
  }

  get() {
    return this.el.checked;
  }

  set({value}) {
    this.el.checked = !!value;
  }
}

BooleanPreference.TYPE = 'bool';
