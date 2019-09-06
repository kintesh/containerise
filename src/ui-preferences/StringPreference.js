import Preference from './Preference';
import template from '!!raw-loader!./StringPreference.html';
import {createEl} from './utils';

export default class StringPreference extends Preference {

  constructor({name, label, description}){
    super({name, label, description});

  }

  _buildEl() {
    return createEl(template);
  }

  get() {
    return this.el.value;
  }

  set({value}) {
    this.el.value = value;
  }
}

StringPreference.TYPE = 'string';
