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
      }, {
        name: 'No Container',
        icon: 'circle',
        iconUrl: 'resource://usercontext-content/circle.svg',
        color: 'grey',
        colorCode: '#999',
        cookieStoreId: 'firefox-default',
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

  it('should add onChanged listener', () => {
    const MOCK_FN = jest.fn();
    ContextualIdentities.addOnUpdateListener(MOCK_FN);
    expect(global.browser.contextualIdentities.onUpdated.addListener).toBeCalledWith(MOCK_FN);
  });

});
