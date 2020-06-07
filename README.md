# <img src="https://gitlab.com/NamingThingsIsHard/firefox/bifulushi/-/raw/master/static/icons/icon.png" alt="Drawing" width="42" align="top"/> bifulushi [![Build Status](https://travis-ci.org/LoveIsGrief/bifulushi.svg?branch=master)](https://travis-ci.com/github/LoveIsGrief/bifulushi)

Firefox extension to automatically open websites in a container.

A fork of the wonderful [containerise][containerise_git].
Containerise hadn't been updated in a while so here's an attempt to continue the work done on it.

|![](https://gitlab.com/NamingThingsIsHard/firefox/bifulushi/-/raw/master/static/screenshots/1.png)  |  ![](https://gitlab.com/NamingThingsIsHard/firefox/bifulushi/-/raw/master/static/screenshots/2.png)  |  ![](https://gitlab.com/NamingThingsIsHard/firefox/bifulushi/-/raw/master/static/screenshots/3.png)  |  ![](https://gitlab.com/NamingThingsIsHard/firefox/bifulushi/-/raw/master/static/screenshots/4.png)|
| --- | --- | --- | --- |
|Select your container and add a domain to always open all visits in the chosen container. | Add many domains as you wish. | Special `No Container` option to break out of a container. | Simple CSV based mapping of a domain to a container by name for easy backup and bulk editing. |


# Installation

**Not yet available**

Install containerise for Firefox from [AMO](https://addons.mozilla.org/en-US/firefox/addon/containerise/)
 in the meantime.

# Usage

## Basic mapping

`amazon.co.uk, Shopping` will open all amazon.co.uk (not subdomains) links in Shopping container.

## Glob
`!*.amazon.co.uk, Shopping`  will be treated as `*.amazon.co.uk` glob pattern. (suitable to subdomains)

## Regex

`@.+\.amazon\.co\.uk$, Shopping` will be treat as `.+\.amazon\.co\.uk$` regex. (suitable to subdomains and complex paths)



# Development

## Available Scripts
In the project directory, you can run:

#### `npm ci`
Installs required dependencies. 

#### `npm run webpack`
Starts webpack with `--watch` option and outputs to `./build` directory.
 
#### `npm run build`
Builds the extension for production use.<br>

#### `npm run test`
Runs test specs using jest.
Use `test:watch` to watch for edits and re-run the tests.

#### `npm run lint`
Lint using eslint.

#### `npm run web-ext`
Runs web-ext process to debug the extension on Firefox. See [web-ext docs](https://github.com/mozilla/web-ext) <br/>
To live reload the extension, start this process in a new tab after starting `npm run webpack` process.


[containerise_git]: https://github.com/kintesh/containerise
