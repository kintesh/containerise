import punycode from 'punycode';

export const PREFIX_REGEX = '@';
export const PREFIX_GLOB = '!';

export const qs = (selector, node) => (node || document).querySelector(selector);
export const qsAll = (selector, node) => (node || document).querySelectorAll(selector);
export const ce = (tagName) => document.createElement(tagName);

/**
 * Makes sure the host coming from user input can be used elsewhere
 *
 * @param host {String}
 * @param caseSensitive {Boolean} Whether the host is case sensitive.
 *                      Insensitive means it should be lowercased
 * @return {String}
 */
export function cleanHostInput(host = '', caseSensitive=true){
  host = host.trim();
  return caseSensitive ? host : host.tolowerCase();
}

const getDomain = (src = '') => src.split('/')[0];
const getPath = (src = '') => src.replace(/^.+?\//, '');

const domainLength = (map) => getDomain(map).replace('*.', '').split('.').length;
const pathLength = (map) => getPath(map).replace('/*', '').split('/').length;

export const sortMaps = (maps) => maps.sort((map1, map2) => {
  const d1 = domainLength(map1.host);
  const d2 = domainLength(map2.host);
  const p1 = pathLength(map1.host);
  const p2 = pathLength(map2.host);
  if (d1 === d2 && p1 === p2) return 0;
  return ((d1 === d2) ? (p1 < p2) : (d1 < d2)) ? 1 : -1;
});

export const domainMatch = (url, map) => {
  const url_host = getDomain(url);
  const map_host = getDomain(map);
  if (map_host.slice(0, 2) !== '*.') return url_host === map_host;
  // Check wildcard matches in reverse order (com.example.*)
  const wild_url = url_host.split('.').reverse();
  const wild_map = map_host.slice(2).split('.').reverse();
  if (wild_url.length < wild_map.length) return false;

  for (let i = 0; i < wild_map.length; ++i)
    if (wild_url[i] !== wild_map[i]) return false;
  return true;
};

export const pathMatch = (url, map) => {
  const url_path = getPath(url);
  const map_path = getPath(map);
  if (map_path === '*' || map_path === '') return true;
  // Paths are always wild
  const wild_url = url_path.split('/');
  const wild_map = map_path.replace('/*', '').split('/');
  if (wild_url.length < wild_map.length) return false;

  for (let i = 0; i < wild_map.length; ++i)
    if (wild_url[i] !== wild_map[i]) return false;
  return true;
};

export const urlKeyFromUrl = (url) => {
  const parsedUrl = new window.URL(url);
  return punycode.toUnicode(parsedUrl.hostname.replace('www.', '')) + parsedUrl.pathname;
};

/**
 * Checks if the URL matches a given hostmap
 *
 * Depending on the prefix in the hostmap it'll choose a match method:
 *  - regex
 *  - glob
 *  - standard
 *
 * @param url {String}
 * @param matchDomainOnly {Boolean=}
 * @param map
 * @return {*}
 */
export const matchesSavedMap = (url, matchDomainOnly, map) => {
  const savedHost = map.host;
  let toMatch = url;
  if (matchDomainOnly) {
    toMatch = new window.URL(url).host;
  }

  if (savedHost[0] === PREFIX_REGEX) {
    const regex = savedHost.substr(1);
    try {
      return new RegExp(regex).test(toMatch);
    } catch (e) {
      console.error('couldn\'t test regex', regex, e);
    }
  } else if (savedHost[0] === PREFIX_GLOB) {
    // turning glob into regex isn't the worst thing:
    // 1. * becomes .*
    // 2. ? becomes .?
    return new RegExp(savedHost.substr(1)
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.?'))
        .test(toMatch);
  } else {
    const key = urlKeyFromUrl(toMatch);
    const _url = ((key.indexOf('/') === -1) ? key.concat('/') : key).toLowerCase();
    const mapHost = ((map.host.indexOf('/') === -1) ? map.host.concat('/') : map.host).toLowerCase();
    return domainMatch(_url, mapHost) && pathMatch(_url, mapHost);

  }
};


export const filterByKey = (dict, func) => {
  return Object.keys(dict)
      .filter(func)
      .reduce((acc, curr) => {
        acc[curr] = dict[curr];
        return acc;
      }, {});
};

/**
 * Replaces occurrences of {variable} in strings
 *
 * It handles camelCase, kebab-case and snake_case variable names
 *
 * @param string {String}
 * @param context {Object}
 * @throws Error when the variable doesn't exist in the context
 * @return {String}
 */
export function formatString(string, context) {
  return string.replace(/(\{([\w_-]+)\})/g, (match, _, token) => {
    const replacement = context[token];
    if (replacement === undefined) {
      throw `Cannot find variable '${token}' in context`;
    }
    return replacement;
  });
}
