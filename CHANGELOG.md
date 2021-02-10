# Changelog
All notable changes to this project will be documented in this file.

## [3.9.0] - 10 Feb 2021
### Added
- Remove temporary tabs if keepOldTabs is true. Fixes #93

### Fixed
- Fix issue where www.* hostnames don't work


## [3.8.1] - 07 Nov 2020
### Added 
- Add "pinned", "discarded", and "isInReaderMode" properties when opening new tabs.


## [3.7.0] - 26 Oct 2019
### Fixed 
- Fix matchDomainOnly without host prefix.

### Changed
- Updated preference UI.


## [3.6.0] - 12 Oct 2019
### Added
- Preference to choose matching hostname or complete URL.
- Help page for "Default containers" option in preference.

### Changed
- Ignore URLs not supported by tabs.create
- Unify Unify container switching conditions. Fixes opening new tab for sites assigned to "No Container".


## [3.5.0] - 8 Oct 2019
### Added
- Preferences centre to customise the extension further.
- Toggle to keep old tabs open.
- Open unmapped domains in a dedicated container.
- Choose container's lifetime, (Forever or Until the last tab is closed).


## [3.4.0] - 3 Sep 2019
### Added
- Introduce preference to leave tabs behind instead of closing them.
- Listen to tab updates to catch events that slip by webrequests.

### Changed
- Fix CSV editor issue where old entries were cleared after saving new ones.


## [3.3.0] - 30 Aug 2019
### Changed
- Generalise the prefix key storage method.
- Move from yarn to npm.


## [3.2.0] - 9 Jul 2019
### Revert
- All unmapped urls now open outside of any container.
- Tabs will not be closed when entering existing a container.


## [3.1.0] - 8 Jul 2019
### Changed
- All unmapped urls now open outside of any container.
- Tabs will not be closed when entering existing a container.


## [3.0.1] - 8 Apr 2019
### Changed
- Fix a bug that prevented the user of `,` (comma) in regex.


## [3.0.0] - 19 Mar 2019
### Added
- Support internationalized domain names with punycode.
- Support for Regex patterns (`@.+\.google\.com$` --> `.+\.google\.com$`)
- Support for Glob patterns (`!*.google.com` --> `*.google.com`)
- Ignore lines starting with `#` during CSV import.
 
### Changed
- Container icons are no longer accessible, fallback to simple indicators.


## [2.5.1] - 25 Oct 2018
### Changed
- Case insensitive matching.
- Changed strict_min_version fro 57 to 53. (Some functionality may not work).

## [2.5.0] - 20 Aug 2018
### Added
- Selects container based on current tab when opening the extension ui.

### Changed
- Opening in container based on Path should work.


## [2.4.0] - 22 May 2018
### Changed
- Various visual changes.


## [2.3.0] - 23 Apr 2018
### AddedPREFIX_GLOB
- Automatically create containers that don't match any exist container when adding a rule in CSV editor.
- Update the list of available container when a is created, removed or updated.

### Changed
- Persist active tabs when visiting a mapped domain with Command+Click (OS X), Ctrl+Click (Windows and Linux).


## [2.2.0] - 6 Apr 2018
### Added
- Allow specific extensions to ask for hostmap (resolves #17)


## [2.1.0] - 1 Nov 2017
### Added
- Added subdomain support thanks to @ethhics
- Set up Travis.

### Changed
Various changes to build system.


## [2.0.0] - 8 Oct 2017
### Added
- Added No Container option to open mapped hosts outside of a container.

### Changed
- Complete redesign of the extension.
- URL mapping no longer relies on the container names
- v1 UI is hidden but can be opened by clicking on the left arrow button.
- **BREAKING** You might loose your mapping from v1*


## [1.0.0] - 1 Oct 2017
### Added
- First release with simplified implementation.
- Get it for Firefox from https://addons.mozilla.org/en-US/firefox/addon/containerise


[3.7.0]: https://github.com/kintesh/containerise/compare/3.6.0...3.7.0
[3.6.0]: https://github.com/kintesh/containerise/compare/3.5.0...3.6.0
[3.5.0]: https://github.com/kintesh/containerise/compare/3.4.0...3.5.0
[3.4.0]: https://github.com/kintesh/containerise/compare/3.3.0...3.4.0
[3.3.0]: https://github.com/kintesh/containerise/compare/3.2.0...3.3.0
[3.2.0]: https://github.com/kintesh/containerise/compare/3.1.0...3.2.0
[3.1.0]: https://github.com/kintesh/containerise/compare/3.0.1...3.1.0
[3.0.1]: https://github.com/kintesh/containerise/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/kintesh/containerise/compare/2.5.1...3.0.0
[2.5.1]: https://github.com/kintesh/containerise/compare/2.5.0...2.5.1
[2.5.0]: https://github.com/kintesh/containerise/compare/2.4.0...2.5.0
[2.4.0]: https://github.com/kintesh/containerise/compare/2.3.0...2.4.0
[2.3.0]: https://github.com/kintesh/containerise/compare/2.2.0...2.3.0
[2.2.0]: https://github.com/kintesh/containerise/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/kintesh/containerise/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/kintesh/containerise/compare/1.0.0...2.0.0
[1.0.0]: https://github.com/kintesh/containerise/compare/aba41d86a7ade84a88c3d12fee221e64f8b36f91...1.0.0
