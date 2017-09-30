# <img src="https://raw.githubusercontent.com/kintesh/containerise/master/static/icons/icon.png" alt="Drawing" width="42" align="top"/> containerise

Firefox extension to automatically open websites in a container


## Available Scripts
In the project directory, you can run:

#### `yarn install`
Installs required dependencies. 

#### `yarn webpack`
Starts webpack with `--watch` option and outputs to `./build` directory.
 
#### `yarn build`
Builds the extension for production use.<br>

#### `yarn test`
Runs test specs using jest.
Use `test:watch` to watch for edits and re-run the tests.

#### `yarn lint`
Lint using eslint.

#### `yarn web-ext`
Runs web-ext process to debug the extension on Firefox.<br/>
To live reload the extension, start this process in a new tab after starting `yarn webpack` process.
