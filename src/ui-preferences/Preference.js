import PreferenceStorage from '../Storage/PreferenceStorage';
import preferenceContainerTemplate from '!!raw-loader!./templates/Preference.html';
import {createEl, qs} from './utils';

export default class Preference {

  constructor({name, label, description = '', defaultValue}) {
    this.name = name;
    this.label = label;
    this.description = description;
    this._defaultValue = defaultValue;
    this.$container = this._buildContainerEl();
    this.el = this._buildEl();
  }

  _buildContainerEl() {
    return createEl(preferenceContainerTemplate);
  }

  _buildEl() {
    let el = document.createElement('input');
    el.classList.add(Preference.EL_CLASS);
    return el;
  }

  async fillContainer() {
    qs('.pref-container__label', this.$container).innerHTML = this.label;
    qs('.pref-container__description', this.$container).innerHTML = this.description;

    // Append the el
    const elContainer = qs('.pref-el-container', this.$container);
    elContainer.appendChild(this.el);
  }


  /**
   * Get value from UI element
   */
  get() {
    throw 'Not implemented';
  }

  /**
   * Update UI with the given value
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  set(value) {
    throw 'Not implemented';
  }

  /**
   * Updates the UI with the DB value
   */
  async updateFromDb() {
    const retrieved = await this.retrieve();
    if (retrieved) {
      this.set(retrieved);
    } else if (this._defaultValue !== undefined) {
      // The db-object looks like {key, value}
      this.set({value: this._defaultValue});
    }
  }

  /**
   * Retrieves value from DB
   *
   * @async
   */
  retrieve() {
    return PreferenceStorage.get(this.name);
  }

  /**
   * Updates the DB with the value from the UI
   *
   * @async
   */
  update() {
    return PreferenceStorage.set({
      key: this.name,
      value: this.get(),
    });
  }

}

Preference.EL_CLASS = 'pref-container__el';
Preference.TYPE = null; // Has to be set by subclass
