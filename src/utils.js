export const qs = (selector, node) => (node || document).querySelector(selector);
export const qsAll = (selector, node) => (node || document).querySelectorAll(selector);
export const ce = (tagName) => document.createElement(tagName);

export const cleanHostInput = (value = '') => value.trim().toLowerCase();

const getDomain = (src = '') => src.split('/')[0];
const getPath = (src = '') => src.replace(/^.+?\//, '');

const domainLength = (map) => getDomain(map).replace('*.', '').split('.').length;
const pathLength = (map) => getPath(map).replace('/*', '').split('/').length;

export const sortMaps = (maps) => maps.sort((map1, map2) => {
  const d1 = domainLength(map1.host);
  const d2 = domainLength(map2.host);
  const p1 = pathLength(map1.host);
  const p2 = pathLength(map2.host);
  if (d1==d2 && p1==p2) return 0;
  return ((d1==d2) ? (p1<p2) : (d1<d2)) ? 1 : -1;
});

export const domainMatch = (url, map) => {
  const url_host = getDomain(url);
  const map_host = getDomain(map.host);
  if (map.host == "test.kinte.sh/here/") {console.log(url_host); console.log(map_host);}
  if (map_host.slice(0,2) != '*.') return url_host == map_host;
  // Check wildcard matches in reverse order (com.example.*)
  const wild_url = url_host.split('.').reverse();
  const wild_map = map_host.slice(2).split('.').reverse();
  if (wild_url.length < wild_map.length) return false;

  for (var i = 0; i < wild_map.length ; ++i)
    if (wild_url[i] != wild_map[i]) return false;
  return true;
};

export const pathMatch = (url, map) => {
  const url_path = getPath(url);
  const map_path = getPath(map.host);
  if (map_path == '*' || map_path == '') return true;
  // Paths are always wild
  const wild_url = url_path.split('/');
  const wild_map = map_path.replace('/*', '').split('/');
  if (wild_url.length < wild_map.length) return false;

  for (var i = 0; i < wild_map.length ; ++i)
    if (wild_url[i] != wild_map[i]) return false;
  return true;
};
