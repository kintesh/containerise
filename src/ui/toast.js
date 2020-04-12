import {qs} from '../utils';

const toast = qs('.toast');

export const showToast = (msg, timeout) => {
  if (msg) {
    toast.innerHTML = msg;
    toast.classList.remove('hide');
  }
  if(timeout){
    setTimeout(hideToast, timeout);
  }
};

export const hideToast = () => toast.classList.add('hide');
