import './CreateEditAction';
import './DeleteAction';
import {setActiveAction} from './utils';

const $actions = document.querySelector('body');
$actions.addEventListener('action-selected', (event) => {
  setActiveAction(event.detail.newAction);
}, true);

