describe('HostStorage', () => {

  let HostStorage;

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

          set: jest.fn((keys) => new Promise((resolve) => resolve(keys))),

          remove: jest.fn((key) => new Promise((resolve) => resolve({key}))),

          clear: jest.fn(() => new Promise((resolve) => resolve())),

        },

        onChanged: {
          addListener: jest.fn(() => {}),
        },
      },
    };

    HostStorage = require('../HostStorage').default;
  });

  it('should get all host maps', () => {
    expect.assertions(1);
    return HostStorage.getAll().then((results) => {
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
    HostStorage.get('http://example.com').then((result) => {
      expect(result).toEqual({
        host: 'example.com',
        container: 'example',
        enabled: true,
      });
    });
    HostStorage.get('http://kinte.sh').then((result) => {
      expect(result).toEqual({
        host: 'kinte.sh/*',
        container: 'personal',
        enabled: true,
      });
    });
    HostStorage.get('http://test.example.com').then((result) => {
      expect(result).toEqual({
        host: '*.example.com',
        container: 'example',
        enabled: true,
      });
    });
    HostStorage.get('http://test.kinte.sh').then((result) => {
      expect(result).toEqual({
        host: '*.kinte.sh/*',
        container: 'personal',
        enabled: true,
      });
    });
    HostStorage.get('http://test.example.com/test').then((result) => {
      expect(result).toEqual({
        host: '*.example.com',
        container: 'example',
        enabled: true,
      });
    });
    HostStorage.get('http://test.kinte.sh/test').then((result) => {
      expect(result).toEqual({
        host: '*.kinte.sh/*',
        container: 'personal',
        enabled: true,
      });
    });
    HostStorage.get('http://test.example.com/here').then((result) => {
      expect(result).toEqual({
        host: 'test.example.com/here',
        container: 'example',
        enabled: true,
      });
    });
    return HostStorage.get('http://test.kinte.sh/here/there').then((result) => {
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
    return HostStorage.setAll(hostMaps).then((keysO) => {
      expect(keysO).toEqual({
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

    expect.assertions(3);
    return HostStorage.set(hostMap).then((keysO) => {
      const keys = Object.keys(keysO);
      expect(keys.length).toEqual(1);
      expect(keys[0]).toEqual('map=example.com');
      expect(keysO[keys[0]]).toEqual({
        host: 'example.com',
        container: 'example',
        enabled: true,
      });
    });
  });

  it('should remove one entry', () => {
    expect.assertions(1);
    return HostStorage.remove('example.com').then(({key}) => {
      expect(key).toEqual(['map=example.com']);
    });
  });

  it('should clear the storage', () => {
    expect.assertions(1);
    return HostStorage.clear().then((result) => {
      expect(result).toBeUndefined();
    });
  });

});
