export const COLORS = [
  'blue',
  'turquoise',
  'green',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'toolbar',
];

export const ICONS = [
  'fingerprint',
  'briefcase',
  'dollar',
  'cart',
  'circle',
  'gift',
  'vacation',
  'food',
  'fruit',
  'pet',
  'tree',
  'chill',
  'fence',
];

const $colorSelector = document.querySelector('.container-action.action-create-edit .color-selector');
const $iconSelector = document.querySelector('.container-action.action-create-edit .icon-selector');

class CreateEditAction {

  constructor() {
    this._fillColors();
    this._fillIcons();
  }


  _fillColors() {
    for (let color of COLORS) {
      let $colorButton = document.createElement('button');
      $colorButton.style.backgroundColor = color;

      $colorSelector.appendChild($colorButton);
    }
  }

  _fillIcons() {
    for (let icon of ICONS) {
      let $icon = document.createElement('img');
      $icon.src = `resource://usercontext-content/${icon}.svg`;

      $iconSelector.appendChild($icon);
    }
  }
}


export default new CreateEditAction();
