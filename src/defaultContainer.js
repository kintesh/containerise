import {formatString} from './utils';
import HostStorage from './Storage/HostStorage';
import ContextualIdentities, {NO_CONTAINER} from './ContextualIdentity';
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
  let container;
  if (containers.length > 0) {
    container = containers[0];
  } else {
    // Create a default container
    container = await ContextualIdentities.create({name});
  }
  const cookieStoreId = container.cookieStoreId;

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
  if(lifetime !== 'forever' && cookieStoreId !== NO_CONTAINER.cookieStoreId){
    await PreferenceStorage.set({
      key: `containers.${cookieStoreId}.lifetime`,
      value: lifetime,
    });
  }

  return container;
}
