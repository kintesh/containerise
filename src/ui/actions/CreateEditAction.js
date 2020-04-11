import {makeActionSelectedTrigger} from './utils';

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

const $container = document.querySelector('.container-action.action-create-edit');
const $colorSelector = $container.querySelector('.color-selector');
const $iconSelector = $container.querySelector('.icon-selector');

const $input = $container.querySelector('input');
const $buttonDone = $container.querySelector('.action-button.done');
const $buttonCancel = $container.querySelector('.action-button.cancel');

class CreateEditAction {

  constructor() {
    this.adding = true;
    this.oldValue = null;

    this.fieldGetters = {};

    this._initFieldGetters();
    this._fillColors();
    this._fillIcons();
    this._connect();
  }

  _initFieldGetters() {
    this.fieldGetters['name'] = () => $input.value;
    this.fieldGetters['color'] = this._getSelected.bind(this, $colorSelector);
    this.fieldGetters['icon'] = this._getSelected.bind(this, $iconSelector);
  }

  _getSelected($selector) {
    let selected = $selector.querySelector('selected');
    if (selected) {
      selected = selected.dataset.icon;
    }
    return selected;
  }

  _connect() {
    $input.addEventListener('change', () => {
      $buttonDone.disabled = !$input.value.trim();
    });
    $buttonDone.addEventListener('click', this.onDone.bind(this));
    makeActionSelectedTrigger($buttonCancel);
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
    let i = 0;
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
  _createIconColorStyles() {
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

  create() {
    console.log('creating', this.getObject());
  }

  save() {
    console.log('saving', this.getObject());
  }

  canSave() {
    let saveWorthy = true;
    for (let fieldName of Object.keys(this.fieldGetters)) {
      let value = this.fieldGetters[fieldName]();
      saveWorthy &= !!value && (this.oldValue ?
              this.oldValue[fieldName] !== value :
              true
      );
      if (!saveWorthy) {
        break;
      }
    }
    return saveWorthy;
  }

  getObject() {
    Object.keys(this.fieldGetters).reduce((acc, curr) => {
      acc[curr] = this.fieldGetters[curr]();
      return acc;
    }, {});
  }

  onDone() {
    if (!this.canSave()) {
      return;
    }
    this.oldValue ? this.save() : this.create();
  }

}


export default new CreateEditAction();
