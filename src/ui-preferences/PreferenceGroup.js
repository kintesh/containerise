import Preference from './Preference';
import {createEl, qs} from './utils';
import template from '!!raw-loader!./templates/PreferenceGroup.html';
import toggleTemplate from '!!raw-loader!./templates/toggle.html';

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
   * @param docUrl {String} A URL to redirect the user too for documentation
   * @param preferences {Preference[]}
   * @param toggleable {boolean} Indicates whether the preferences
   *                    can be toggled on and off together
   */
  constructor({name, label, description, docUrl, preferences, toggleable = false}) {
    super({name, label, description, docUrl});
    for (let preference of preferences) {
      if (!preference.name.startsWith(`${name}.`)) {
        throw `Preference names must start with ${name}`;
      }
    }
    this._preferences = preferences;
    this._toggleable = toggleable;
    if (this._toggleable) {
      this.$container.classList.add('pref-group--toggable');
    }
  }

  _buildEl() {
    const $toggle = createEl(toggleTemplate);
    qs('.pref-group__toggle', this.$container).appendChild($toggle);
    return $toggle.querySelector('.toggle__checkbox');
  }

  _onChange(newValue) {
    this.$container.classList.toggle('pref-group--active', newValue);
    super._onChange(newValue);
  }

  async fillContainer() {
    const $label = qs('.pref-group__label', this.$container);
    $label.innerHTML = this.label;
    this._addDescription($label);
    this._fillDocLink();
    this._createOnChange('change');
    const $preferences = this.$container.querySelector('.preferences');
    return Promise.all(this._preferences.map((preference) => {
      preference.addListener('change', (newValue) => {
        this._triggerEvent('childChange', preference, newValue);
      });
      preference.addListener('childChange', (...args) => {
        this._triggerEvent('childChange', ...args);
      });
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
      this.$container.classList.toggle('pref-group--active', value);
      super.set({value});
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

PreferenceGroup.TEMPLATE = template;
PreferenceGroup.TYPE = 'group';
