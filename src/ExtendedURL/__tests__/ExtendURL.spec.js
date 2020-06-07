describe('utils', () => {

  const ExtendedURL = require('../index').default;

  it('should have domain', function () {
    const eUrl = new ExtendedURL('https://gist.github.com');
    expect(eUrl.domain).toEqual('github');
    expect(eUrl.tld).toEqual('com');
  });

  it('should resolve IPv4 to IPv4 address', function () {
    const eUrl = new ExtendedURL('https://192.168.7.1');
    expect(eUrl.domain).toEqual('192.168.7.1');
    expect(eUrl.tld).toEqual('192.168.7.1');
  });

  it('should resolve IPv6 to IPv6 address', function () {
    const eUrl = new ExtendedURL('https://[2001:db8::8a2e:370:7334]');
    expect(eUrl.domain).toEqual('[2001:db8::8a2e:370:7334]');
    expect(eUrl.tld).toEqual('[2001:db8::8a2e:370:7334]');
  });

});
