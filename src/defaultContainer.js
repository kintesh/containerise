import {formatString} from './utils';
import HostStorage from './Storage/HostStorage';
import ContextualIdentities from './ContextualIdentity';
import ExtendedURL from './ExtendedURL';
import PreferenceStorage from './Storage/PreferenceStorage';

export async function buildDefaultContainer(preferences, url) {
  url = new ExtendedURL(url);
  let name = preferences['defaultContainer.containerName'];
  name = formatString(name, {
    ms: Date.now(),
    domain: url.domain,
    fqdn: url.host,
    host: url.host,
    tld: url.tld,
  });

  // Get cookieStoreId
  const containers = await ContextualIdentities.get(name);
  let cookieStoreId;
  if (containers.length > 0) {
    cookieStoreId = containers[0].cookieStoreId;
  } else {
    // Create a default container
    const container = await ContextualIdentities.create(name);
    cookieStoreId = container.cookieStoreId;
  }

  // Add a rule if necessary
  const ruleAddition = preferences['defaultContainer.ruleAddition'];
  if (ruleAddition) {
    try {
      const host = formatString(ruleAddition, {
        domain: url.domain,
        fqdn: url.host,
        host: url.host,
        tld: url.tld,
      });
      await HostStorage.set({
        host: host,
        cookieStoreId,
        containerName: name,
        enabled: true,
      });
    } catch (e) {
      console.error('Couldn\'t add rule', ruleAddition, e);
    }
  }

  const lifetime = preferences['defaultContainer.lifetime'];
  if(lifetime !== 'forever'){
    await PreferenceStorage.set({
      key: `containers.${cookieStoreId}.lifetime`,
      value: lifetime,
    });
  }

  return cookieStoreId;
}
