# automation-base


This project contains the basic common functionality for protractor UI tests. As this is the base level this project will contain only those things that will apply to all tests.

Examples of things found in this project:
  - logging in test users
  - starting up browsers
  - communicating with SauceLabs
  - setting cookies
  - logging and other configuration tasks.


### Creating a test project that uses this common library
The base class has been updated to work with protractor 5.
This requires that you have node 6.9.x or above.

This section assumes that protractor and node.js is already installed on your machine.  If not go here: [Node.js][nodeLink] before continuing.  When node is done installing open a terminal window and enter this command: ```npm install -g protractor```
Once Node and Protractor are setup you'll need to setup a test project.  This is just a standard .js project you'd create in whatever ide you desire.  However there are a couple of required files needed to access the common library.
  - config.json - this is your config file.  See here for a sample: [config.json][confJsonLink]
  - baseConf.js - this is a replacment for protractor's conf.js file.  Here's the code to copy into your own: [baseConf.js][protractorConfLink]
  - Also inside the test project's package.json this dependency should be added:  ```"automation-base": "git+https://github.com/IntelligentSigma/automation-base.git"```  Here's a sample package.json:  [package.json][packageLink]
  - Here is a link to a sample project with tests and files: [Sample Project][sampleProjectLink]


Write your tests and make sure that the paths to each test file are included in the conf.json and local.json suites line. (see the above example conf.json)

### Accessing common code inside tests:
  - Use this require statement to access the common library methods:
  ```
      var qa = new (require('automation-base/lib/protractor-lib.js'));
  ```
  - See here for another example test: [SourceTitleTest.js][sampleTest]

### Launching tests and configuration
  - Follow the instructions here: [Running and settings][confluenceLocalLink]

### Navigating this project:
  - lib/config - contains the code for configuring the common library to run.  This manages what browser, where to run and other configuration needed to run tests.
  - lib/extensions - contains utilites that all teams should use - setting cookies and experiements.  The code here differs from the automation-base-utils project in that BaseUtils is an optional project whereas this one is required to run tests.
  - lib/login - contains the code for logging in users
  - protractor-lib.js - the wrapper for all of the above files.  This is what the test will require to access common library methods.  ex:
      ```
      var qa = new (require('automation-base/lib/protractor-lib.js'));
      ```

[nodeLink]: <https://nodejs.org/en/>
[protractorLink]: <https://angular.github.io/protractor/#/>
[confJsonLink]: <https://github.com/IntelligentSigma/automation-example/blob/master/config.json>
[localJson]: <https://github.com/IntelligentSigma/automation-example/blob/master/local.json>
[protractorConfLink]: <https://github.com/IntelligentSigma/automation-example/blob/master/baseConf.js>
[packageLink]: <https://github.com/IntelligentSigma/automation-example/blob/master/package.json>
[baseEncode]: <https://www.base64encode.org/>
[sampleProjectLink]: <https://github.com/IntelligentSigma/automation-example>
