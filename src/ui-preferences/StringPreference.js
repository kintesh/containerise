import Preference from './Preference';

export default class StringPreference extends Preference {

  _buildEl() {
    let el = super._buildEl();
    el.type = 'text';
    return el;
  }

  get() {
    return this.el.value;
  }

  set({value}) {
    this.el.value = value;
    super.set({value});
  }
}

StringPreference.TYPE = 'string';
