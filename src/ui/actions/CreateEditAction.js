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
    this.fieldGetters['color'] = this._getSelected.bind(this,
        $colorSelector,
        'color'
    );
    this.fieldGetters['icon'] = this._getSelected.bind(this,
        $iconSelector,
        'icon'
    );
  }

  _getSelected($selector, dataAttribute) {
    let selected = $selector.querySelector('.selected');
    if (selected) {
      selected = selected.dataset[dataAttribute];
    }
    return selected;
  }

  _connect() {
    $input.addEventListener('change', () => {
      $buttonDone.disabled = !$input.value.trim();
    });
    $buttonDone.addEventListener('click', this.onDone.bind(this));
    makeActionSelectedTrigger($buttonCancel);

    // Handle events in the selectors
    this._connectSelector($colorSelector, this._updateIconColor.bind(this));
    this._connectSelector($iconSelector);
  }

  /**
   * Marks an item in a selector as selected
   *
   * @param $selector {HTMLElement}
   * @param finalAction {Function?} Optionally do something after events have been handled
   * @private
   */
  _connectSelector($selector, finalAction) {
    $selector.addEventListener('click', (event) => {
      const $el = event.target;
      if (!$el.classList.contains('item') || $el.classList.contains('selected')) {
        return;
      }
      for (let $item of $el.parentElement.querySelectorAll('.item')) {
        $item.classList.remove('selected');
      }
      $el.classList.add('selected');

      finalAction && finalAction($el);
    });
  }

  _fillColors() {
    for (let color of COLORS) {
      let $colorButton = document.createElement('button');
      $colorButton.classList.add('item');
      $colorButton.dataset.color = color;
      $colorButton.style.backgroundColor = color;

      $colorSelector.appendChild($colorButton);
    }
  }

  _fillIcons() {
    this._createIconColorStyles();
    for (let icon of ICONS) {
      // Icon container contains a background set in CSS
      let $iconContainer = document.createElement('div');
      $iconContainer.classList.add('item');

      let $icon = document.createElement('div');
      $icon.classList.add('icon');
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
        .icon-selector[data-color="${color}"]{
          --icon-color: ${color};
        }
      `;
    }
    $container.appendChild($style);
  }

  _updateIconColor(){
    $iconSelector.dataset.color = this.fieldGetters.color();
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
    return Object.keys(this.fieldGetters).reduce((acc, curr) => {
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
