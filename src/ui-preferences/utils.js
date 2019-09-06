export function createEl(string){
  const $el = document.createElement('div');
  $el.innerHTML = string;
  return $el.firstChild;
}
