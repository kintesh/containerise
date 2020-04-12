import State from '../State';
import {NO_CONTAINER} from '../ContextualIdentity';
import {qs} from '../utils';
import {setActiveAction} from './actions/utils';

const csSelected = qs('.container-selector-selected');
const csList = qs('.container-selector-list');
const csItem = qs('.container-selector-item');

const $container = document.querySelector('.main-header');
const $add = $container.querySelector('button.add');
const $edit = $container.querySelector('button.edit');
const $delete = $container.querySelector('button.delete');

class ContainerSelector {

  constructor(state) {
    this.state = state;
    State.addListener(this.update.bind(this));
    csSelected.addEventListener('click', this.toggleOptions.bind(this));
    this.render();
    this._connect();
  }

  _connect() {
    $add.addEventListener('click',
        this._setActiveAction.bind(this, 'create-edit', null));
    $edit.addEventListener('click',
        this._setActiveAction.bind(this, 'create-edit', undefined));
    $delete.addEventListener('click',
        this._setActiveAction.bind(this, 'delete', undefined));
  }

  _setActiveAction(actionName, actionItem) {
    if (actionItem === undefined) {
      actionItem = this.state.selectedIdentity;
    }
    State.set('actionItem', actionItem);
    setActiveAction(actionName);
  }

  update(newState) {
    this.state = newState;
    this.render();
    this.updateButtons();
  }

  updateButtons(){
    let addEnabled = this.state.identities && this.state.identities.length > 0;
    let editEnabled = false;
    let deleteEnabled = false;
    if(this.state.selectedIdentity
        && this.state.selectedIdentity.name !== NO_CONTAINER.name){
      editEnabled = true;
      deleteEnabled = true;
    }
    $add.disabled = !addEnabled;
    $edit.disabled = !editEnabled;
    $delete.disabled = !deleteEnabled;
  }

  render() {
    if (!this.state.identities || !this.state.selectedIdentity) {
      return false;
    }

    let selectedIdentity = this.state.selectedIdentity;

    csList.innerHTML = '';
    this.state.identities.forEach((identity) => {
      const item = this.createItem(identity);
      item.setAttribute('data-id', identity.cookieStoreId);
      item.addEventListener('click', this.selectOption.bind(this, identity));
      csList.appendChild(item);

      if (this.state.selectedIdentity && identity.cookieStoreId === this.state.selectedIdentity.cookieStoreId) {
        selectedIdentity = identity;
      }
    });

    if (selectedIdentity) {
      csSelected.innerHTML = '';
      const item = this.createItem(selectedIdentity);
      csSelected.appendChild(item);
    }
  }

  createItem(identity) {
    const item = csItem.cloneNode(true);
    item.classList.remove('template');
    const icon = qs('.icon', item);
    if (identity.cookieStoreId === NO_CONTAINER.cookieStoreId) {
      icon.innerHTML = '<span class="no-container-icon">&otimes;</span>';
      icon.style.color = identity.colorCode;
    } else {
      icon.style.maskImage = `url(${identity.iconUrl})`;
      icon.style.background = identity.colorCode;
    }
    const name = qs('.name', item);
    name.innerHTML = identity.name;

    return item;
  }

  toggleOptions() {
    if (csList.classList.contains('collapsed')) {
      csList.classList.remove('collapsed');
    } else {
      csList.classList.add('collapsed');
    }
  }

  selectOption(identity) {
    State.set('selectedIdentity', identity);
    this.toggleOptions();
  }

}

export default new ContainerSelector({
  identities: State.get('identities'),
  selectedIdentity: State.get('selectedIdentity'),
});
