# Default containers

The container into which tabs will be placed that cannot be placed into any other container. 
In other words, if a tab opens or updates its URL to one that cannot be matched by a rule in the extension, 
 it will be put into a default container according to the preferences listed below.

## Preferences

The title of the group, as seen by the user, will be **Default container**. 
The entire group can be toggled on or off. 
If off, nothing will be done with unmatched URLs. 

Once activated the following preferences will come into effect:

**Container name** (string input)

The name the default container will possess. It will be possible to create a dynamic name using certain variables:

 - ms: current time in milliseconds
 - domain: the simple domain without the TLD or anything else
 - fqdn: [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name)
   host will work as an alias
 - tld: [TLD](https://en.wikipedia.org/wiki/Top-level_domain)

Other variables can be requested (most likely in feature requests).

Examples:

|  URL                       | bifulushi_{ms}          | {domain} |  {fqdn}            | default container  |
|----------------------------|----------------------------|----------|--------------------|--------------------|
|  https://example.com       | bifulushi_1567718601836 |  example |  example.com       | default container  |
| https://old.example.com    | bifulushi_1567718628706 |  example | old.example.com    |  default container |
| https://an.old.example.com | bifulushi_1567718738989 | example  | an.old.example.com | default container  |

**Lifetime** (choice list)

 - Forever: self-explanatory
 - Until last tab is closed: Once the last tab in the container is closed, the container will be deleted too

**Rule addition** (string input)

This will create an a rule for the container.

Available variables:

 - domain: the simple domain without the TLD or anything else
 - fqdn: [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name)
 - tld: [TLD](https://en.wikipedia.org/wiki/Top-level_domain)

Examples:

|  URL                       | *.{domain}.* | *.{domain}.{tld} |  {fqdn}            |
|----------------------------|--------------|------------------|--------------------|
|  https://example.com       |  \*.example.* | *.example.com    |  example.com       |
| https://old.example.com    | \*.example.*  | *.example.com    | old.example.com    |
| https://an.old.example.com | \*.example.*  | *.example.com    | an.old.example.com |
