import Preference from './Preference';
import {createEl, qs} from './utils';
import template from '!!raw-loader!./templates/PreferenceGroup.html';

/**
 * Groups preferences together and displays them in a manner to reflect that fact.
 */
export default class PreferenceGroup extends Preference {

  /**
   *
   * @param name {String} The name to be used as prefix for all keys of the preferences
   *                e.g windowOptions --> preferences will be windowOptions.optionX
   * @param label {String} The title to be shown to the user
   * @param description {String} The description to be shown to the user
   * @param preferences {Preference[]}
   * @param toggleable {boolean} Indicates whether the preferences
   *                    can be toggled on and off together
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
    if(this._toggleable){
      this.$container.classList.add('pref-group_toggable');
    }
  }

  _buildContainerEl() {
    return createEl(template);
  }

  _buildEl() {
    return this.$container.querySelector(`.${PreferenceGroup.EL_CLASS}`);
  }

  async fillContainer() {
    qs('.pref-group__label', this.$container).innerHTML = this.label;
    qs('.pref-group__description', this.$container).innerHTML = this.description;

    const $preferences = this.$container.querySelector('.preferences');
    return Promise.all(this._preferences.map((preference) => {
      $preferences.appendChild(preference.$container);
      return preference.fillContainer();
    }));
  }

  get() {
    return this._toggleable ?
        this.el.checked
        : false;
  }


  set({value}) {
    if (this._toggleable) {
      this.el.checked = value;
    }
  }

  async updateFromDb() {
    super.updateFromDb();
    return Promise.all(this._preferences.map((preference) => preference.updateFromDb()));
  }

  update() {
    return Promise.all([super.update()].concat(
        this._preferences.map((preference) => preference.update())
    ));

  }
}

PreferenceGroup.TYPE = 'group';
PreferenceGroup.EL_CLASS = 'pref-group__toggle';
