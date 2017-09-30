import './styles/style.scss';
import './index.html';
import {qs} from '../utils';
import Storage from '../Storage/index';

const HOST_MAPS_SPLIT_KEY = ',';
const loader = qs('.loader');
const hostMapsTextarea = qs('.host-maps-textarea');
const saveButton = qs('.save-button');

const showLoader = () => loader.classList.remove('hide');
const hideLoader = () => loader.classList.add('hide');
const cleanInput = (value = '') => value.trim().toLowerCase();

const loadHostMapFromStorage = () => {
  showLoader();
  hostMapsTextarea.value = 'Loading...';

  Storage.getAll().then((results) => {
    let hostMaps = '';
    for (const key in results) {
      const map = results[key];
      hostMaps += `${map.host} ${HOST_MAPS_SPLIT_KEY} ${map.container}\n`;
    }
    hostMapsTextarea.value = hostMaps;
    hideLoader();
  });
};

const saveButtonHandler = () => {
  showLoader();

  const hostMaps = hostMapsTextarea.value.trim().split('\n');
  const hostMapsObj = {};

  hostMaps.map((hostMap) => {
    const hostMapParts = hostMap.split(HOST_MAPS_SPLIT_KEY);
    const host = cleanInput(hostMapParts[0]);
    const container = cleanInput(hostMapParts[1]);

    if (host && container) {
      hostMapsObj[host] = {
        host,
        container,
        enabled: true,
      };
    }
  });

  Promise.all([
    Storage.clear(),
    Storage.setAll(hostMapsObj),
  ]).then(() => {
    hideLoader();
    saveButton.innerHTML = 'Saved!';
    setTimeout(() => saveButton.innerHTML = 'Save', 3000);
  });
};

loadHostMapFromStorage();
saveButton.addEventListener('click', saveButtonHandler);
