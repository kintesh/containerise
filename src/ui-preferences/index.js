import './styles/index.scss';
import './index.html';
import './InfoTooltip';
import preferencesJson from './preferences.json';
import BooleanPreference from './BooleanPreference';
import ChoicePreference from './ChoicePreference';
import ContainerPreferenceGroup from './ContainerPreferenceGroup';
import PreferenceGroup from './PreferenceGroup';
import StringPreference from './StringPreference';
import {qs} from './utils';

function buildPreference(prefConf) {
  switch (prefConf.type) {
    case BooleanPreference.TYPE:
      return new BooleanPreference(prefConf);
    case ChoicePreference.TYPE:
      return new ChoicePreference(prefConf);
    case PreferenceGroup.TYPE:
      prefConf.preferences = prefConf.preferences.map((groupPrefConf) => {
        return buildPreference(Object.assign({}, groupPrefConf, {
          name: `${prefConf.name}.${groupPrefConf.name}`,
        }));
      });
      return new PreferenceGroup(prefConf);
    case StringPreference.TYPE:
      return new StringPreference(prefConf);
    case ContainerPreferenceGroup.TYPE:
      return new ContainerPreferenceGroup(prefConf);
    default:
      throw new TypeError(`unknown preference type ${prefConf.type}`);
  }

}

// Build the preferences
let preferences = preferencesJson.map(buildPreference);

const preferencesContainer = qs('.preferences-container');

preferences.map(async (preference) => {
  // Save preference on UI change
  preference.addListener('change', () => {
    preference.update();
  });
  preference.addListener('childChange', (child) => {
    child.update();
  });
  preferencesContainer.appendChild(preference.$container);
  await preference.fillContainer();
  await preference.updateFromDb();
});

