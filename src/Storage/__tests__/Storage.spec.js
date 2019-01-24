describe('Storage', () => {

  let Storage;

  beforeEach(() => {
    global.browser = {
      storage: {
        local: {

          get: jest.fn(() => new Promise((resolve) =>
            resolve({
              'map=example.com': {
                host: 'example.com',
                container: 'example',
                enabled: true,
              },
              'map=kinte.sh/*': {
                host: 'kinte.sh/*',
                container: 'personal',
                enabled: true,
              },
              'map=*.example.com': {
                host: '*.example.com',
                container: 'example',
                enabled: true,
              },
              'map=*.kinte.sh/*': {
                host: '*.kinte.sh/*',
                container: 'personal',
                enabled: true,
              },
              'map=test.example.com/here': {
                host: 'test.example.com/here',
                container: 'example',
                enabled: true,
              },
              'map=test.kinte.sh/here': {
                host: 'test.kinte.sh/here',
                container: 'personal',
                enabled: true,
              },
            }),
          )),

          set: jest.fn((key, value) => new Promise((resolve) => resolve({key, value}))),

          remove: jest.fn((key) => new Promise((resolve) => resolve({key}))),

          clear: jest.fn(() => new Promise((resolve) => resolve())),

        },

        onChanged: {
          addListener: jest.fn(() => {}),
        },
      },
    };

    Storage = require('../index').default;
  });

  it('should get all host maps', () => {
    expect.assertions(1);
    return Storage.getAll().then((results) => {
      expect(results).toEqual({
        'example.com': {
          host: 'example.com',
          container: 'example',
          enabled: true,
        },
        'kinte.sh/*': {
          host: 'kinte.sh/*',
          container: 'personal',
          enabled: true,
        },
        '*.example.com': {
          host: '*.example.com',
          container: 'example',
          enabled: true,
        },
        '*.kinte.sh/*': {
          host: '*.kinte.sh/*',
          container: 'personal',
          enabled: true,
        },
        'test.example.com/here': {
          host: 'test.example.com/here',
          container: 'example',
          enabled: true,
        },
        'test.kinte.sh/here': {
          host: 'test.kinte.sh/here',
          container: 'personal',
          enabled: true,
        },
      });
    });
  });

  it('should get by key', () => {
    expect.assertions(8);
    Storage.get('http://example.com').then((result) => {
      expect(result).toEqual({
        host: 'example.com',
        container: 'example',
        enabled: true,
      });
    });
    Storage.get('http://kinte.sh').then((result) => {
      expect(result).toEqual({
        host: 'kinte.sh/*',
        container: 'personal',
        enabled: true,
      });
    });
    Storage.get('http://test.example.com').then((result) => {
      expect(result).toEqual({
        host: '*.example.com',
        container: 'example',
        enabled: true,
      });
    });
    Storage.get('http://test.kinte.sh').then((result) => {
      expect(result).toEqual({
        host: '*.kinte.sh/*',
        container: 'personal',
        enabled: true,
      });
    });
    Storage.get('http://test.example.com/test').then((result) => {
      expect(result).toEqual({
        host: '*.example.com',
        container: 'example',
        enabled: true,
      });
    });
    Storage.get('http://test.kinte.sh/test').then((result) => {
      expect(result).toEqual({
        host: '*.kinte.sh/*',
        container: 'personal',
        enabled: true,
      });
    });
    Storage.get('http://test.example.com/here').then((result) => {
      expect(result).toEqual({
        host: 'test.example.com/here',
        container: 'example',
        enabled: true,
      });
    });
    return Storage.get('http://test.kinte.sh/here/there').then((result) => {
      expect(result).toEqual({
        host: 'test.kinte.sh/here',
        container: 'personal',
        enabled: true,
      });
    });
  });

  it('should set all', () => {
    const hostMaps = {
      'example.com': {
        host: 'example.com',
        container: 'example',
        enabled: true,
      },
      'kinte.sh': {
        host: 'kinte.sh',
        container: 'personal',
        enabled: true,
      },
    };

    expect.assertions(1);
    return Storage.setAll(hostMaps).then(({key}) => {
      expect(key).toEqual({
        'map=example.com': {
          host: 'example.com',
          container: 'example',
          enabled: true,
        },
        'map=kinte.sh': {
          host: 'kinte.sh',
          container: 'personal',
          enabled: true,
        },
      });
    });
  });

  it('should set one entry', () => {
    const hostMap = {
      host: 'example.com',
      container: 'example',
      enabled: true,
    };

    expect.assertions(2);
    return Storage.set(hostMap).then(({key, value}) => {
      expect(key).toEqual('map=example.com');
      expect(value).toEqual({
        host: 'example.com',
        container: 'example',
        enabled: true,
      });
    });
  });

  it('should remove one entry', () => {
    expect.assertions(1);
    return Storage.remove('example.com').then(({key}) => {
      expect(key).toEqual('map=example.com');
    });
  });

  it('should clear the storage', () => {
    expect.assertions(1);
    return Storage.clear().then((result) => {
      expect(result).toBeUndefined();
    });
  });

  it('should add onChanged listener', () => {
    const MOCK_FN = jest.fn();
    Storage.addOnChangedListener(MOCK_FN);
    expect(global.browser.storage.onChanged.addListener).toBeCalledWith(MOCK_FN);
  });

});
