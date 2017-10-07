class ContextualIdentities {

  constructor() {
    this.contextualIdentities = browser.contextualIdentities;
  }

  getAll(details = {}) {
    return this.contextualIdentities.query(details);
  }

  get(name) {
    return this.contextualIdentities.query({name});
  }

  addOnUpdateListener(fn) {
    browser.contextualIdentities.onUpdated.addListener(fn);
  }

}

export default new ContextualIdentities();
