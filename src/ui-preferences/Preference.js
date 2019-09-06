import PreferenceStorage from '../Storage/PreferenceStorage';

export default class Preference {

  // TODO: Add the notion of a default value
  constructor({name, label, description}) {
    this.name = name;
    this.label = label;
    this.description = description;
    this.el = this._buildEl();
  }

  _buildEl() {
    const template = document.querySelector(`template#${this.constructor.TEMPLATE_PREFIX}${this.constructor.TYPE}`);
    return template.content
        .cloneNode(true)
        .querySelector(this.constructor.EL_QS);
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
    this.set(await this.retrieve());
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

Preference.TEMPLATE_PREFIX = 'preference-t-';
Preference.EL_QS = '.pref-t-el';
Preference.TYPE = null; // Has to be set by subclass
