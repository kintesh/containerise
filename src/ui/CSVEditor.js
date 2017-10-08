import State from '../State';
import Storage from '../Storage';
import {qs} from '../utils';
import {showLoader, hideLoader} from './loader';
import {cleanHostInput} from '../utils';

const HOST_MAPS_SPLIT_KEY = ',';
const csvEditor = qs('.csv-editor');
const openButton = qs('.ce-open-button');
const closeButton = qs('.ce-close-button');
const saveButton = qs('.ce-save-button');
const hostTextarea = qs('.ce-hosts-textarea');

class CSVEditor {

  constructor(state) {
    this.state = state;
    State.addListener(this.update.bind(this));
    openButton.addEventListener('click', this.showEditor.bind(this));
    closeButton.addEventListener('click', this.hideEditor.bind(this));
    saveButton.addEventListener('click', this.saveUrlMaps.bind(this));
    this.render();
  }

  update(newState) {
    this.state = newState;
    this.render();
  }

  render() {
    showLoader();

    if(!this.state.urlMaps || !this.state.identities) {
      return false;
    }

    let hostMaps = '';
    for (const key in this.state.urlMaps) {
      const urlMap = this.state.urlMaps[key];
      hostMaps += `${urlMap.host} ${HOST_MAPS_SPLIT_KEY} ${urlMap.containerName}\n`;
    }
    hostTextarea.value = hostMaps;

    hideLoader();
  }

  saveUrlMaps() {
    showLoader();
    const items = hostTextarea.value.trim().split('\n');
    const maps = {};

    items.map((item) => {
      const hostMapParts = item.split(HOST_MAPS_SPLIT_KEY);
      const host = cleanHostInput(hostMapParts[0]);
      const containerName = hostMapParts[1];

      if (host && containerName) {
        const identity = this.state.identities.find((identity) => cleanHostInput(identity.name) === cleanHostInput(containerName));
        if (identity) {
          maps[host] = {
            host,
            cookieStoreId: identity.cookieStoreId,
            containerName: identity.name,
            enabled: true,
          };
        }
      }
    });

    Promise.all([
      Storage.clear(),
      Storage.setAll(maps),
    ]).then(() => {
      hideLoader();
      saveButton.innerHTML = 'Saved!';
      setTimeout(() => saveButton.innerHTML = 'Save', 3000);
    });
  }

  showEditor() {
    csvEditor.classList.remove('hide');
  }

  hideEditor() {
    csvEditor.classList.add('hide');
  }

}

export default new CSVEditor({
  urlMaps: State.get('urlMaps'),
  identities: State.get('identities'),
});
