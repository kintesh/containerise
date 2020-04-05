describe('utils', () => {

  const ExtendedURL = require('../index').default;

  it('should have domain', function () {
    const eUrl = new ExtendedURL('https://gist.github.com');
    expect(eUrl.domain).toEqual('github');
    expect(eUrl.tld).toEqual('com');
  });

  it('should resolve IP to IP domain', function () {
    const eUrl = new ExtendedURL('https://192.168.7.1');
    expect(eUrl.domain).toEqual('192.168.7.1');
    expect(eUrl.tld).toEqual('192.168.7.1');
  });


});
