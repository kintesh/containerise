import {qs} from '../utils';

const toast = qs('.toast');

export const showToast = (msg) => {
  if (msg) {
    toast.innerHTML = msg;
    toast.classList.remove('hide');
  }
};

export const hideToast = () => toast.classList.add('hide');
