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

  update(tabId, options = {}) {
    return this.tabs.update(tabId, options);
  }

  remove(tabId) {
    return this.tabs.remove(tabId);
  }

  query(queryInfo = {}) {
    return this.tabs.query(queryInfo);
  }
}

export default new Tabs();
