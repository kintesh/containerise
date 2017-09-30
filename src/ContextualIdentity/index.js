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
}

export default new ContextualIdentities();
