export function createEl(string){
  const $el = document.createElement('div');
  $el.innerHTML = string;
  return $el.firstElementChild;
}

export function qs(selector, el = document) {
  return el.querySelector(selector);
}
