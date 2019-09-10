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
      description: 'How long this container will live',
      choices: [
        {
          'name': 'forever',
          'label': 'Forever',
          'description': 'Container will always be present after creation',
        },
        {
          'name': 'untilLastTab',
          'label': 'Until last tab is closed',
          'description': 'Closing the last tab in the container will destroy the container',
        },
      ],
      defaultValue: 'forever',
    }));
  }

}

ContainerPreference.TYPE = 'container';
