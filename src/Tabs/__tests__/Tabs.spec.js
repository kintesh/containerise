describe('Tabs', () => {

  let Tabs;

  beforeEach(() => {
    global.browser = {
      tabs: {

        get: jest.fn((tabId) => new Promise((resolve) =>
          resolve({
            id: tabId,
            cookieStoreId: 'cookie store',
          }),
        )),

        create: jest.fn((options) => new Promise((resolve) =>
          resolve({
            ...options,
          })
        )),

        remove: jest.fn(() => new Promise((resolve) => resolve())),
      },
    };

    Tabs = require('../index').default;
  });

  it('should get tab by id', () => {
    expect.assertions(1);
    return Tabs.get(42).then((tab) => {
      expect(tab).toEqual({
        id: 42,
        cookieStoreId: 'cookie store',
      });
    });
  });

  it('should create a tab', () => {
    const options = {
      url: 'https://url.com',
      cookieStoreId: 'cookie store',
      index: 41,
    };
    expect.assertions(1);
    return Tabs.create(options).then((tab) => {
      expect(tab).toEqual(options);
    });
  });

  it('should remove a tab', () => {
    expect.assertions(1);
    return Tabs.remove(42).then((tab) => {
      expect(tab).toBeUndefined();
    });
  });

});
