import ContextualIdentities from '../ContextualIdentity';
import PreferenceGroup from './PreferenceGroup';
import ContainerPreference from './ContainerPreference';

/**
 * Contains a @see{ContainerPreference} for each existing container
 */
export default class ContainerPreferenceGroup extends PreferenceGroup {

  constructor({name, label, description}) {
    super({name, label, description, preferences: [], toggleable: false});
  }

  async fillContainer() {
    // Get all existing containers and create ContainerPref
    this._preferences = (await ContextualIdentities.get())
        .map((container) => {
          return new ContainerPreference({
            name: `${this.name}.${container.cookieStoreId}`,
            label: container.name,
          });
        });
    return super.fillContainer();
  }

  async updateFromDb() {
    return Promise.all(this._preferences.map((preference) => preference.updateFromDb()));
  }

}

ContainerPreferenceGroup.TYPE = 'containers';
