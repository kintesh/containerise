import './styles/index.scss';
import './index.html';
import BooleanPreference from './BooleanPreference';

function qs(selector, el = document) {
  return el.querySelector(selector);
}

// Build the preferences
const preferences = [
  new BooleanPreference('closeOldTabs',
      'Close old tabs',
      'After a contained tab has been created, the old will be closed'),
];

const preferencesContainer = qs('.preferences-container');
const preferenceTemplate = qs('template#preference-template').content;
for (const preference of preferences) {
  const prefContainer = preferenceTemplate.cloneNode(true);

  // Set some attributes
  qs('.pref-container__label', prefContainer).innerHTML = preference.ui_name;
  qs('.pref-container__description', prefContainer).innerHTML = preference.description;

  // Append the el
  const prefTypeContainer = qs('.pref-type-container', prefContainer);
  prefTypeContainer.appendChild(preference.el);


  preferencesContainer.appendChild(prefContainer);

  preference.updateFromDb();
}

const $saveButton = qs('#save-button');
$saveButton.addEventListener('click', async () => {
  await Promise.all(preferences.map(preference => preference.update()));
});
