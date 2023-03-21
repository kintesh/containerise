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
                utils.matchesSavedMap('https://duckduckgo.com', matchDomainOnly, {
                  host: 'duckduckgo.com',
                })
            ).toBe(true);
          });
        });

        function testPrefixes(pattern, expectedUrl, evilUrl) {
          return () => {
            it('should match url without path', () => {
              expect(
                  utils.matchesSavedMap(
                      expectedUrl,
                      matchDomainOnly, {
                        host: pattern,
                      })
              ).toBe(true);
            });
            it('should match url with path', () => {
              expect(
                  utils.matchesSavedMap(
                    expectedUrl + '/?q=search+me+baby',
                      matchDomainOnly, {
                        host: pattern,
                      })
              ).toBe(true);
            });
            let prefix = matchDomainOnly ? 'should not' : 'should';
            let description = `${pattern} ${prefix} match ${evilUrl}`;
            it(description, () => {
              expect(
                  utils.matchesSavedMap(
                      evilUrl,
                      matchDomainOnly, {
                        host: pattern,
                      })
              ).toBe(!matchDomainOnly);
            });
          };
        }

        describe('with regex host prefix', testPrefixes(
            '@duckduckgo\\.com',
            'https://duckduckgo.com',
            'https://google.com/?q=duckduckgo'));

        describe('with glob host prefix', testPrefixes(
            '!duckduckgo.com',
            'https://duckduckgo.com',
            'https://google.com/?q=duckduckgo'));

        describe('with regex host prefix', testPrefixes(
            '@duckduckgo\\.com',
            'https://duckduckgo.com',
            'https://evil.duckduckgo.com.evil.com'));

        describe('with glob host prefix', testPrefixes(
            '!duckduckgo.com',
            'https://duckduckgo.com',
            'https://evil.duckduckgo.com.evil.com'));

        describe('with glob subdomain prefix', testPrefixes(
            '!*.duckduckgo.com',
            'https://example.duckduckgo.com',
            'https://notduckduckgo.com'));

        describe('with regex subdomain prefix', testPrefixes(
            '@(.+)\\.duckduckgo\\.com',
            'https://example.duckduckgo.com',
            'https://notduckduckgo.com'));
      };
    }

    test();
    describe('with matchDomainOnly', test(true));

  });

});
