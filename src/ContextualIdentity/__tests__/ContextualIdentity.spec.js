describe('ContextualIdentities', () => {

  let ContextualIdentities;

  beforeEach(() => {
    global.browser = {
      contextualIdentities: {

        query: jest.fn((details) => new Promise((resolve) => {
          if (details.name === 'MOCK') {
            resolve([{
              name: 'Mock',
              cookieStoreId: 'cookie store',
            }]);
          } else {
            resolve([{
              name: 'Mock 1',
              cookieStoreId: 'cookie store 1',
            }, {
              name: 'Mock 2',
              cookieStoreId: 'cookie store 2',
            }]);
          }}),
        ),

        onCreated: {
          addListener: jest.fn(() => {}),
        },

        onRemoved: {
          addListener: jest.fn(() => {}),
        },

        onUpdated: {
          addListener: jest.fn(() => {}),
        },
      },
    };

    ContextualIdentities = require('../index').default;
  });

  it('should get all identities', () => {
    expect.assertions(1);
    return ContextualIdentities.getAll().then(identities => {
      expect(identities).toEqual([{
        name: 'Mock 1',
        cookieStoreId: 'cookie store 1',
      }, {
        name: 'Mock 2',
        cookieStoreId: 'cookie store 2',
      }]);
    });
  });

  it('should get single identity', () => {
    expect.assertions(1);
    return ContextualIdentities.get('MOCK').then(identities => {
      expect(identities).toEqual([{
        name: 'Mock',
        cookieStoreId: 'cookie store',
      }]);
    });
  });

  it('should add onCreated listener', () => {
    const MOCK_FN = jest.fn();
    ContextualIdentities.addOnCreateListener(MOCK_FN);
    expect(global.browser.contextualIdentities.onCreated.addListener).toBeCalledWith(MOCK_FN);
  });

  it('should add onRemoved listener', () => {
    const MOCK_FN = jest.fn();
    ContextualIdentities.addOnRemoveListener(MOCK_FN);
    expect(global.browser.contextualIdentities.onRemoved.addListener).toBeCalledWith(MOCK_FN);
  });

  it('should add onChanged listener', () => {
    const MOCK_FN = jest.fn();
    ContextualIdentities.addOnUpdateListener(MOCK_FN);
    expect(global.browser.contextualIdentities.onUpdated.addListener).toBeCalledWith(MOCK_FN);
  });

  it('should add all three (onCreated, onRemoved and onChanged) listeners', () => {
    const MOCK_FN = jest.fn();
    ContextualIdentities.addOnChangedListener(MOCK_FN);
    expect(global.browser.contextualIdentities.onCreated.addListener).toBeCalledWith(MOCK_FN);
    expect(global.browser.contextualIdentities.onRemoved.addListener).toBeCalledWith(MOCK_FN);
    expect(global.browser.contextualIdentities.onUpdated.addListener).toBeCalledWith(MOCK_FN);
  });

});
