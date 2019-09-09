import './styles/index.scss';
import './index.html';
import preferencesJson from './preferences.json';
import BooleanPreference from './BooleanPreference';
import ChoicePreference from './ChoicePreference';
import PreferenceGroup from './PreferenceGroup';
import StringPreference from './StringPreference';
import {qs} from './utils';

// TODO make this a class function
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
    default:
      console.warn('unknown preference type', prefConf);
  }

}

// Build the preferences
let preferences = preferencesJson.map(buildPreference);

const preferencesContainer = qs('.preferences-container');

for (const preference of preferences) {
  preference.fillContainer();
  preferencesContainer.appendChild(preference.$container);
  // noinspection JSIgnoredPromiseFromCall
  preference.updateFromDb();
}

const $saveButton = qs('#save-button');
$saveButton.addEventListener('click', async () => {
  await Promise.all(preferences.map(preference => preference.update()));
});
