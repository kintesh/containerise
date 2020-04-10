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
    this._createIconColorStyles();
    let i=0;
    for (let icon of ICONS) {
      // Icon container contains a background set in CSS
      let $iconContainer = document.createElement('div');
      $iconContainer.classList.add('icon-container');

      let $icon = document.createElement('div');
      $icon.classList.add('icon');
      $icon.dataset.color = COLORS[i++ % COLORS.length];
      $icon.style = `
        background-image: url(resource://usercontext-content/${icon}.svg);
      `;
      $iconContainer.appendChild($icon);

      $iconSelector.appendChild($iconContainer);
    }
  }

  /**
   * Generate a style that allows using a data-attribute to set the icon color
   * @private
   */
  _createIconColorStyles(){
    let $style = document.createElement('style');
    for (let color of COLORS) {
      $style.innerHTML += `
        .icon[data-color="${color}"]{
          --color: ${color};
        }
      `;
    }
    $iconSelector.appendChild($style);
  }
}


export default new CreateEditAction();
