/**
 * Groups preferences together and displays them in a manner to reflect that fact.
 */
export default class PreferenceGroup {

  /**
   *
   * @param prefix {String} The prefix to be used for all keys of the preferences
   *                e.g windowOptions --> preferences will be windowOptions.optionX
   * @param uiTitle {String} The title to be shown to the user
   * @param uiDescription {String} The description to be shown to the user
   * @param preferences {Preference[]}
   * @param toggleable {boolean} Indicates whether the preferences
   *                    can be toggled together
   */
  constructor(prefix, uiTitle, uiDescription, preferences, toggleable=false){
    this.prefix = prefix;
    this._uiTitle = uiTitle;
    this._uiDescription = uiDescription;
    this._preferences = preferences;
    this._toggleable = toggleable;
    this._enabled = false;
  }
}
