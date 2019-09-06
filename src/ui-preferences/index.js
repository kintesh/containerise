import './styles/index.scss';
import './index.html';
import preferencesJson from './preferences.json';
import BooleanPreference from './BooleanPreference';
import ChoicePreference from './ChoicePreference';
import PreferenceGroup from './PreferenceGroup';
import StringPreference from './StringPreference';

function qs(selector, el = document) {
  return el.querySelector(selector);
}


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
const preferenceTemplate = qs('template#preference-template').content;

// TODO: Put this in to the class
function showPreference(preference, container) {
  const prefContainer = preferenceTemplate.cloneNode(true);

  // Set some attributes
  qs('.pref-container__label', prefContainer).innerHTML = preference.label;
  qs('.pref-container__description', prefContainer).innerHTML = preference.description;

  // Append the el
  const prefTypeContainer = qs('.pref-type-container', prefContainer);
  prefTypeContainer.appendChild(preference.el);


  container.appendChild(prefContainer);

  // noinspection JSIgnoredPromiseFromCall
  preference.updateFromDb();
}

function showPreferenceGroup(group) {
  const $el = group.el;
  qs('.pref-group__label', $el).innerHTML = group.label;
  qs('.pref-group__description', $el).innerHTML = group.description;


  for (let preference of group._preferences) {
    showPreference(preference, $el.querySelector('.preferences'));
  }
  preferencesContainer.appendChild($el);
  // noinspection JSIgnoredPromiseFromCall
  group.updateFromDb();
}

for (const preference of preferences) {
  if (preference.constructor.TYPE === 'group') {
    showPreferenceGroup(preference);
  } else {
    showPreference(preference, preferencesContainer);
  }
}

const $saveButton = qs('#save-button');
$saveButton.addEventListener('click', async () => {
  await Promise.all(preferences.map(preference => preference.update()));
});
