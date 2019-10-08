import PreferenceStorage from '../Storage/PreferenceStorage';
import preferenceContainerTemplate from '!!raw-loader!./templates/Preference.html';
import {createEl, qs} from './utils';

/**
 * @var $container {HTMLElement} Should contain the label, description and other fields
 *                 It's the element that should be added to the DOM
 * @var el {HTMLElement} Is the element that will be used to get and set values.
 */
export default class Preference {

  constructor({name, label, description = '', defaultValue}) {
    this.name = name;
    this.label = label;
    this.description = description;
    this._defaultValue = defaultValue;
    this.$container = this._buildContainerEl();
    this._valueDb = null;
    this._listeners = {};
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

  /**
   * Registers the event listeners and decides when to trigger
   * an onChange event for the preference
   * @private
   */
  _createOnChange(event='input') {
    const listener = (e) => {
      e.stopPropagation();
      this._onChange(this.get());
    };
    this.$container.addEventListener(event, listener);
  }

  /**
   *
   * @param newValue
   * @private
   */
  _onChange(newValue) {
    if (newValue === this._valueDb) {
      return;
    }
    this._triggerEvent('change', newValue);
  }

  addListener(event, func) {
    const listeners = this._listeners[event] || [];
    listeners.push(func);
    this._listeners[event] = listeners;
  }

  removeListener(func, event) {
    for (let eventKey of this._listeners) {
      if (event !== undefined && event !== eventKey) {
        continue;
      }
      this._listeners[event] = this._listeners[event].filter(listener => listener === func);
    }
  }

  _triggerEvent(event, ...args) {
    const listeners = this._listeners[event];
    if (!listeners) {
      return;
    }
    for (let listener of listeners) {
      listener.apply(this, args);
    }
  }

  /**
   * Should fill the fields in {@see $container} with initial preference attributes and add {@see el} to the container
   */
  async fillContainer() {
    qs('.pref-container__label', this.$container).innerHTML = this.label;
    qs('.pref-container__description', this.$container).innerHTML = this.description;

    // Append the el
    const elContainer = qs('.pref-el-container', this.$container);
    elContainer.appendChild(this.el);
    this._createOnChange();
  }


  /**
   * Get value from UI element
   */
  get() {
    throw 'Not implemented';
  }

  /**
   * Update UI with the given value
   */
  // eslint-disable-next-line no-unused-vars
  set({value}) {
    this._valueDb = this.get();
  }

  /**
   * Updates the UI with the DB value
   */
  async updateFromDb() {
    let retrieved = undefined;
    try {
      retrieved = await this.retrieve();
      if (retrieved) {
        this.set(retrieved);
      }
    } catch (e) {
      console.warn(e);
    }

    if (retrieved === undefined && this._defaultValue !== undefined) {
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
    return PreferenceStorage.get(this.name).then((retrieved) => {
      if(retrieved){
        this._valueDb = retrieved.value;
      }
      return retrieved;
    });
  }

  /**
   * Updates the DB with the value from the UI
   *
   * @async
   */
  update() {
    const newValue = this.get();
    return PreferenceStorage.set({
      key: this.name,
      value: newValue,
    }).then(() => {
      this._valueDb = newValue;
    });
  }

}

Preference.EL_CLASS = 'pref-container__el';
Preference.TYPE = null; // Has to be set by subclass
