import {formatString} from './utils';
import HostStorage from './Storage/HostStorage';
import ContextualIdentities from './ContextualIdentity';
import ExtendedURL from './ExtendedURL';

export async function buildDefaultContainer(preferences, url) {
  url = new ExtendedURL(url);
  let name = preferences['defaultContainer.containerName'].value;
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
  const ruleAddition = preferences['defaultContainer.ruleAddition'].value;
  if (ruleAddition) {
    await HostStorage.set({
      host: formatString(ruleAddition, {}),
      cookieStoreId,
      containerName: name,
      enabled: true,
    });
  }

  return cookieStoreId;
}
