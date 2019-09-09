describe('utils', () => {

  const ExtendedURL = require('../index').default;

  it('should have domain', function () {
    const eUrl = new ExtendedURL('https://gist.github.com');
    expect(eUrl.domain).toEqual('github');
    expect(eUrl.tld).toEqual('com');
  });


});
