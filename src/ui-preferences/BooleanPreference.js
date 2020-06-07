import Preference from './Preference';
import {createEl, qs} from './utils';
import toggleTemplate from '!!raw-loader!./templates/toggle.html';

export default class BooleanPreference extends Preference {

  _createOnChange() {
    super._createOnChange('change');
  }

  _buildEl() {
    return createEl(toggleTemplate);
  }

  _getCheckbox(){
    return qs('.toggle__checkbox', this.el);
  }
  get() {
    return this._getCheckbox().checked;
  }

  set({value}) {
    this._getCheckbox().checked = !!value;
    super.set({value});
  }
}

BooleanPreference.TYPE = 'bool';
