/**
 * @jest-environment jsdom
 */

describe('utils', () => {

  const utils = require('../utils');

  describe('formatString', () => {
    it('should return same string without variables', function () {
      const string = 'Farouq Nadeeb';
      expect(utils.formatString(string, {}))
          .toEqual(string);
    });

    it('should replace alphanumeric variables', function () {
      const name = 'Farouq';
      const lastName = 'Nadeeb';
      expect(utils.formatString('{name} {lastName}', {
        name, lastName,
      })).toEqual(`${name} ${lastName}`);
    });

    it('should replace kebab-case variables', function () {
      const name = 'Farouq';
      const lastName = 'Nadeeb';
      expect(utils.formatString('{name} {last-name}', {
        name, ['last-name']: lastName,
      })).toEqual(`${name} ${lastName}`);
    });

    it('should throw on non-existent variables', function () {
      const name = 'Farouq';
      const lastName = 'Nadeeb';
      expect(() => {
        utils.formatString('{name} {lastName} - born {dob}', {
          name, lastName,
        });
      }).toThrow('Cannot find variable \'dob\' in context');
    });

  });

  describe('filterByKey', () => {
    it('should create object with keys that don\'t start with a string', function () {
      expect(utils.filterByKey({
        removeThis: 'lol',
        removeThat: 'rofl',
        removeAnother: 'do eet!',
        keepMe: 'kept',
        keepThem: 'kept',
      }, (key) => !key.startsWith('remove')))
          .toEqual({
            keepMe: 'kept',
            keepThem: 'kept',
          });
    });

    it('should fail without a filter function', function () {
      expect(() => {
        utils.filterByKey({
          a: true,
          b: true,
        });
      }).toThrow('undefined is not a function');
    });

  });

  describe('matchesSavedMap', () => {
    function test(matchDomainOnly) {
      matchDomainOnly = !!matchDomainOnly;
      return () => {
        describe('without host prefix', () => {
          it('should match url without path', () => {
            expect(
                utils.matchesSavedMap('https://duckduckgo.com', matchDomainOnly, undefined, {
                  host: 'duckduckgo.com',
                })
            ).toBe(true);
          });
          it('should match url with container', () => {
            expect(utils.matchesSavedMap('https://duckduckgo.com', matchDomainOnly, 'some container', {
                  host: '<some container>duckduckgo.com',
                })
            ).toBe(true);
          });
          it('should match url with no container', () => {
            expect(utils.matchesSavedMap('https://duckduckgo.com', matchDomainOnly, '', {
                  host: '<>duckduckgo.com',
                })
            ).toBe(true);
          });
          it('should match url with any container when unspecified', () => {
            expect(utils.matchesSavedMap('https://duckduckgo.com', matchDomainOnly, 'some container', {
                  host: 'duckduckgo.com',
                })
            ).toBe(true);
          });
          it('should not match url with mismatched container', () => {
            expect(utils.matchesSavedMap('https://duckduckgo.com', matchDomainOnly, 'some container', {
                  host: '<other container>duckduckgo.com',
                })
            ).toBe(false);
          });
        });

        function testPrefixes(isRegex) {
          isRegex = !!isRegex;
          const simplePattern = isRegex?
              '@duckduckgo\\.com' : '!duckduckgo.com';
          const containerNamePattern = isRegex?
              '@<some container>duckduckgo\\.com' : '!<some container>duckduckgo.com';
          
          return () => {
            it('should match url without path', () => {
              expect(
                  utils.matchesSavedMap(
                      'https://duckduckgo.com',
                      matchDomainOnly, undefined, {
                        host: simplePattern,
                      })
              ).toBe(true);
            });
            it('should match url with path', () => {
              expect(
                  utils.matchesSavedMap(
                      'https://duckduckgo.com/?q=search+me+baby',
                      matchDomainOnly, undefined, {
                        host: simplePattern,
                      })
              ).toBe(true);
            });
            let prefix = matchDomainOnly ? 'should not' : 'should';
            let description = `${prefix} match url with pattern only in path`;
            it(description, () => {
              expect(
                  utils.matchesSavedMap(
                      'https://google.com/?q=duckduckgo',
                      matchDomainOnly, undefined, {
                        host: simplePattern,
                      })
              ).toBe(!matchDomainOnly);
            });
            it('should match url without path and container', () => {
              expect(
                  utils.matchesSavedMap(
                      'https://duckduckgo.com',
                      matchDomainOnly, 'some container', {
                        host: containerNamePattern,
                      })
              ).toBe(true);
            });
            it('should match url with path and container', () => {
              expect(
                  utils.matchesSavedMap(
                      'https://duckduckgo.com/?q=search+me+baby',
                      matchDomainOnly, 'some container', {
                        host: containerNamePattern,
                      })
              ).toBe(true);
            });
          };
        }

        describe('with regex host prefix', testPrefixes(true));
        describe('with glob host prefix', testPrefixes());
      };
    }

    test();
    describe('with matchDomainOnly', test(true));

  });

});
