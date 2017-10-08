import State from '../State';
import Storage from '../Storage';
import {qs, qsAll} from '../utils';
import {showLoader, hideLoader} from './loader';
import {cleanHostInput} from '../utils';

const addButton = qs('.add-button');
const saveButton = qs('.save-button');
const umMaps = qs('.url-maps-list');
const umItem = qs('.url-map-item');

class URLMaps {

  constructor(state) {
    this.state = state;
    State.addListener(this.update.bind(this));
    addButton.addEventListener('click', this.addItem.bind(this, ''));
    saveButton.addEventListener('click', this.saveUrlMaps.bind(this));
    this.render();
    this.itemsCount = 0;
  }

  update(newState) {
    this.state = newState;
    this.render();
  }

  render() {
    showLoader();
    if(!this.state.urlMaps || !this.state.selectedIdentity) {
      return false;
    }

    umMaps.innerHTML = '';
    this.itemsCount = 0;

    for (const key in this.state.urlMaps) {
      const urlMap = this.state.urlMaps[key];
      if (this.state.selectedIdentity.cookieStoreId === urlMap.cookieStoreId) {
        this.addItem(urlMap.host);
      }
    }

    hideLoader();
  }

  addItem(host) {
    const item = umItem.cloneNode(true);
    item.setAttribute('data-id', String(this.itemsCount));
    item.classList.remove('template');
    qs('.url-input', item).value = host;
    qs('.remove-button', item).addEventListener('click', this.removeUrlMap.bind(this, this.itemsCount, host));
    umMaps.appendChild(item);
    this.itemsCount++;
  }

  removeUrlMap(rowId, host) {
    umMaps.removeChild(qs(`[data-id='${String(rowId)}']`));
    Storage.remove(host);
  }

  saveUrlMaps() {
    showLoader();
    const items = qsAll('.url-map-item');
    const maps = {};

    for (const item of items) {
      const urlInput = qs('.url-input', item);
      const host = cleanHostInput(urlInput && urlInput.value);

      if (host) {
        maps[host] = {
          host,
          containerName: this.state.selectedIdentity.name,
          cookieStoreId: this.state.selectedIdentity.cookieStoreId,
          enabled: true,
        };
      }
    }

    Promise.all([
      Storage.setAll(maps),
    ]).then(() => {
      hideLoader();
      saveButton.innerHTML = 'Saved!';
      setTimeout(() => saveButton.innerHTML = 'Save', 3000);
    });
  }

}

export default new URLMaps({
  urlMaps: State.get('urlMaps'),
  selectedIdentity: State.get('selectedIdentity'),
});
