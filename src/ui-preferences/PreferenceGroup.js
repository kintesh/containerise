/**
 * Groups preferences together and displays them in a manner to reflect that fact.
 */
import Preference from './Preference';
import {createEl} from './utils';
import template from '!!raw-loader!./PreferenceGroup.html';

export default class PreferenceGroup extends Preference {

  /**
   *
   * @param name {String} The name to be used as prefix for all keys of the preferences
   *                e.g windowOptions --> preferences will be windowOptions.optionX
   * @param label {String} The title to be shown to the user
   * @param description {String} The description to be shown to the user
   * @param preferences {Preference[]}
   * @param toggleable {boolean} Indicates whether the preferences
   *                    can be toggled together
   */
  constructor({name, label, description, preferences, toggleable = false}) {
    super({name, label, description});
    for (let preference of preferences) {
      if (!preference.name.startsWith(`${name}.`)) {
        throw `Preference names must start with ${name}`;
      }
    }
    this._preferences = preferences;
    this._toggleable = toggleable;
  }

  _buildEl() {
    return createEl(template);
  }

  get() {
    return this._toggleable ?
        this._getToggleEl().checked
        : false;
  }

  _getToggleEl() {
    return this.el.querySelector('.pref-group__toggle');
  }

  set({value}) {
    if (this._toggleable) {
      this._getToggleEl().checked = value;
    }
  }

  async updateFromDb() {
    super.updateFromDb();
    return Promise.all(this._preferences.map((preference) => preference.updateFromDb()));
  }
}

PreferenceGroup.TYPE = 'group';
