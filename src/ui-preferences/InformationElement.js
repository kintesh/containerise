import css from '!!raw-loader!./styles/InformationElement.css';

export default class InformationElement extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({mode: 'open'});

    const $style = document.createElement('style');
    $style.textContent = css;

    const $span = document.createElement('span');
    $span.textContent = this.textContent;
    const text = this.getAttribute('text');
    if(text){
      $span.setAttribute('text', text);
    }
    shadow.appendChild($span);
    shadow.appendChild($style);

  }

  static get observedAttributes() {
    return ['text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'text') {
      console.log('setting text to', newValue);
      this.shadowRoot.querySelector('span').setAttribute('text', newValue);
    }
  }

}

customElements.define('c-information', InformationElement);
