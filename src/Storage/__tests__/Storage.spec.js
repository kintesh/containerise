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
              'map=kinte.sh': {
                host: 'kinte.sh',
                container: 'personal',
                enabled: true,
              },
            }),
          )),

          set: jest.fn((key, value) => new Promise((resolve) => resolve({key, value}))),

          clear: jest.fn(() => new Promise((resolve) => resolve())),

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
        'kinte.sh': {
          host: 'kinte.sh',
          container: 'personal',
          enabled: true,
        },
      });
    });
  });

  it('should get by key', () => {
    expect.assertions(1);
    return Storage.get('example.com').then((result) => {
      expect(result).toEqual({
        host: 'example.com',
        container: 'example',
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

  it('should clear the storage', () => {
    expect.assertions(1);
    return Storage.clear().then((result) => {
      expect(result).toBeUndefined();
    });
  });

});
