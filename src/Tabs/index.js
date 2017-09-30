class Tabs {

  constructor() {
    this.tabs = browser.tabs;
  }

  get(tabId) {
    return this.tabs.get(tabId);
  }

  create(options = {}) {
    return this.tabs.create(options);
  }

  remove(tabId) {
    return this.tabs.remove(tabId);
  }

}

export default new Tabs();
