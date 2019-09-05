/**
 * Groups preferences together and displays them in a manner to reflect that fact.
 */
export default class PreferenceGroup {

  /**
   *
   * @param prefix {String} The prefix to be used for all keys of the preferences
   *                e.g windowOptions --> preferences will be windowOptions.optionX
   * @param ui_title {String} The title to be shown to the user
   * @param ui_description {String} The description to be shown to the user
   * @param preferences {Preference[]}
   * @param toggleable {boolean} Indicates whether the preferences
   *                    can be toggled together
   */
  constructor(prefix, ui_title, ui_description, preferences, toggleable=false){
    this.prefix = prefix;
    this._ui_title = ui_title;
    this._ui_description = ui_description;
    this._preferences = preferences;
    this._toggleable = toggleable;
    this._enabled = false;
  }
}
