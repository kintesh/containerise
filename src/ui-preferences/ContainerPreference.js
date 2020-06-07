import PreferenceGroup from './PreferenceGroup';
import ChoicePreference from './ChoicePreference';

/**
 * Preferences for containers
 *
 * This will build all the preferences a container can possess e.g lifetime.
 * Other preferences like icon, color and exit rules are conceivable
 */
export default class ContainerPreference extends PreferenceGroup {

  constructor({name, label, description}) {
    super({name, label, description, preferences: [], toggleable: false});
    this._preferences.push(new ChoicePreference({
      name: `${name}.lifetime`,
      label: 'Lifetime',
      choices: [
        {
          'name': 'forever',
          'label': 'Forever',
        },
        {
          'name': 'untilLastTab',
          'label': 'Until last tab is closed',
        },
      ],
      defaultValue: 'forever',
    }));
  }

}

ContainerPreference.TYPE = 'container';
