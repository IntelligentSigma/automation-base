var fs = require("fs");
var localeHelper = new (require('automation-locale/lib/localeHelper.js'));

var _configJsonPath = 0; //path of the config file passed into constructor

//flag set to true if --params.config is encountered as cmd line argument
var paramsConfigEncountered = false;

var ScreenResolutionForWindows10 = ['1024x768', '1152x864', '1280x768', '1280x800', '1280x960', '1280x1024', '1400x1050', '1440x900', '1600x1200',
                                    '1680x1050', '1920x1080', '1920x1200', '2560x1600'];
var ScreenResolutionForWindows81 = ['1024x768', '1152x864', '1280x768', '1280x800', '1280x960', '1280x1024', '1400x1050', '1440x900', '1600x1200',
                                    '1680x1050','1920x1080', '1920x1200', '2560x1600'];
var ScreenResolutionForWindows8 = ['1024x768', '1152x864', '1280x768', '1280x800', '1280x960', '1280x1024', '1400x1050', '1440x900', '1600x1200',
                                   '1680x1050', '1920x1080', '1920x1200', '2560x1600'];
var ScreenResolutionForWindows7 = ['1024x768', '1152x864', '1280x768', '1280x800', '1280x960', '1280x1024', '1440x900', '1600x1200', '1680x1050',
                                   '1920x1080', '1920x1200', '2560x1600'];
var ScreenResolutionForOSX1011 = ['1024x768', '1152x864', '1280x960', '1376x1032', '1600x1200', '1920x1440', '2048x1536'];
var ScreenResolutionForLinux = ['1024x768'];

var BrowsersForWindows10 = ['chrome', 'firefox', 'MicrosoftEdge', 'internet explorer'];
var BrowsersForWindows81 = ['chrome', 'firefox', 'internet explorer'];
var BrowsersForWindows8 = ['chrome', 'firefox'];
var BrowsersForWindows7 = ['chrome', 'firefox', 'internet explorer'];
var BrowsersForOSX1011 = ['chrome', 'firefox', 'safari'];
var BrowsersForLinux = ['chrome', 'firefox'];

var OperatingSystemsThatSupportChrome = ['Windows 10', 'Windows 8.1', 'Windows 8', 'Windows 7', 'Linux', 'OS X 10.11'];
var OperatingSystemsThatSupportFirefox = ['Windows 10', 'Windows 8.1', 'Windows 8', 'Windows 7', 'Linux', 'OS X 10.11'];
var OperatingSystemsThatSupportMicrosoftEdge = ['Windows 10'];
var OperatingSystemsThatSupportSafari = ['OS X 10.11'];
var OperatingSystemsThatSupportInternetExplorer = ['Windows 10', 'Windows 8.1', 'Windows 7'];

var AllSupportedOperatingSystems = ['Windows 10', 'Windows 8.1', 'Windows 8', 'Windows 7', 'Linux', 'OS X 10.11'];
var AllSupportedBrowsers = ['chrome', 'firefox', 'safari', 'internet explorer'];
var AllSupportedResolutions = ['1024x768', '1152x864', '1280x768', '1280x800', '1280x960', '1280x1024', '1400x1050', '1440x900', '1600x1200',
                               '1680x1050', '1920x1080', '1920x1200', '2560x1600'];
var CommonResolutionToAll = "1024x768";
var TestConfig = (function() {
  var path = require('path');
  var q = require('q');
  var loginService;
  var TEST_CONFIG_FILE_NAME = 'localConfig.json';
  var testParameters = {
    accountType: { type: "string", value: "MEMBER", description: "the type of account to log in as" },
    afterLaunchLogin: { type: "boolean", value: false, description: "login during the onPrepare method for each browser instance" },
    baseHost: { type: "string", value: "localhost:5000", description: "base hostname to direct protractor methods" },
    beforeLaunchLogin: { type: "boolean", value: true, description: "login once in beforeLaunch protractor method for all browser instances" },
    displayInfo: { type: "boolean", value: true, description: "Log out test configuration before running test" },
    email: {type: "string", value: "", description: "email address to send failed notices to" },
    environment: { type: "string", value: "[{\"browserName\":\"chrome\"}]", description: "environment list (os, browser, version, resolution)" },
    failFast: {type: "boolean", value: false, description: "Stop running spec on first failure" },
    framework: {type: "string", value: "jasmine2", description: "Test framework to use. This may be one of: jasmine, jasmine2, cucumber, mocha or custom."},
    generateHTMLReport: { type: "string", value: "", description: "generate an html report at relative path (e.g. /test/client/reports/)" },
    globalTimeout: { type: "Number", value: 60000, description: "global Default test wait timeout in milliseconds" },
    ignoreSynchronization: { type: "boolean", value: false, description: "if set to true, non-angular pages will be testable" },
    locale: { type: "string", value: "en", description: "simple locale (e.g. en)" },
    location: { type: "string", value: "LOCAL", description: "LOCAL to use local selenium server, or SAUCE to point to sauce vms " },
    loginUserKeyMap: { type: "filename", value: "",  description: "path to JSON file specifying login user by key" },
    loginUsers: { type: "filename", value: "", description: "path to JSON file specifhing login users" },
    maximizeWindow: { type: 'boolean', value: true, description: "maximize window on driver start up" },
    maxThreads: { type: 'string', value: "10", description: "maximum number of threads to use for tests" },
    mochaOpts: { type: 'object', value: {reporter:"spec"}, description: "mocha Options, only works with framework mocha" },
    proxyUrl: { type: "string", value: "", description: "TF a proxy Url path is needed (e.g. https://your.organization.com/fileName.pac) " },
    repository: {type: "object", value: "", description: "Repository path" },
    retries: { type: "Number", value: 0, description: "Number of time to retry an it before failing, (Current only works with mocha, for jasmine lookup protrator-flake)"},
    runInParallel: { type: "boolean", value: true, description: "run test suites in parallel" },
    sauceKey: { type: "string", value: "", description: "sauce key (obfuscated)" },
    sauceUser: { type: "string", value: "", description: "sauce username (obfuscated)" },
    suites: { type: "string", value: "", description: "path to JSON test suite file" },
    testFilter: { type: "string", value: "", description: "test name filter to restrict tests to, requires specifying suites" },
    timestampEx: {type: "boolean", value:false, description: "timestamp experiment for test-data-service" },
    username: { type: "boolean", value: "", description: "restrict login to particular username. requires specifying loginUsers." },
    waitTimeout: { type: "Number", value: 60000, description: "Default wait timeout in milliseconds" },
    webReport: { type: "boolean", value: false, description: "report test runs to an internal web service" }
  };

  function TestConfig(protractorDirectory, configPath, cmdLineArgTesting) {

    _configJsonPath = configPath; //set the JSON file path.

    this.config = getConfigFromCommandLine(testParameters, cmdLineArgTesting);

    // Compute additional configuration
    this.config.protractorDirectory = protractorDirectory;
    this.config.afterLaunch = this.getAfterLaunch(this.config.beforeLaunchLogin);

    // Test Target can be localhost:5000
    this.config.rootUrl = (this.config.baseHost === "localhost:5000") ? "http://" + this.config.baseHost : "https://" + this.config.baseHost;
    this.config.baseUrl = this.config.rootUrl + "/" + this.config.app;
    this.config.dataCreationBaseHost = this.getDataCreationBaseHost(this.config.dataCreationBaseHost, this.config.baseHost);
    this.config.devKey = this.config.devKey ? (new Buffer(this.config.devKey, 'base64')).toString() : "";
    this.config.sauceKey = this.config.location === "SAUCE" ? (new Buffer(this.config.sauceKey, 'base64')).toString() : "";
    this.config.sauceUser = this.config.location === "SAUCE" ? (new Buffer(this.config.sauceUser, 'base64')).toString() : "";
    if (!this.config.seleniumAddress) { //allow for option in config.json
      this.config.seleniumAddress = this.config.location === "LOCAL" ? 'http://localhost:4444/wd/hub' : "";
    }

    // Delay found to be necessary when using sessionhighjack to set browser cookie
    // required when running against localhost:5000
    this.config.sessionHijackOverrunTimeout = this.config.sessionHijackOverrunTimeout || 1000;
    this.config.maxSessions = this.config.runInParallel ? this.config.maxThreads : undefined;
    this.config.multiCapabilities = this.getMultiCapabilities(this.config.sauceUser, this.config.environment,
                                    this.config.maxSessions, this.config.runInParallel, this.config.proxyUrl);
    this.config.suites = getTestSuites(this.config);
    this.config.mochaOpts = getMochaOpts(this.config);
    this.config.jasmineNodeOpts = getJasmineNodeOpts(this.config);
    //use this for uniquely identifying each suite that is run
    this.config.testKey ='tKey' + new Date().getTime();
    if(this.config.webReport) {
      this.config.testKey = 'tKey' + new Date().getTime();
      if(this.config.baseHost.includes('google.com')) {
        this.config.envRun = 'int';
      } else if(this.config.baseHost.includes('beta.google.com') || this.config.baseHost.includes('beta.google.com')) {
        this.config.envRun = 'beta';
      } else if(this.config.baseHost ==='prod.google.com' || this.config.baseHost.includes('prod.google.com')) {
        this.config.envRun = 'prod';
      } else {
        this.config.envRun = 'local';
      }
      var reporting = {
        "webReport": this.config.webReport,
        "testKey": this.config.testKey,
        "envRun": this.config.envRun
      };
      if(this.config.suites.home){
          reporting.testNum = ''+this.config.suites.home.length+'';
      }
    }
    loginService = new(require('../login/loginService.js'))(this.config);
    this.config.beforeLaunch = this.getBeforeLaunch(this.config.beforeLaunchLogin, this.config.loginUsers, this.config.username,
                                                    this.config.accountType, this.config.timestampEx, reporting);
    this.config.onPrepare = this.getOnPrepare();

    if (this.config.baseHost === "localhost:5000" && this.config.runInParallel) {
      console.log(
        "###################################################################################\n" +
        " !!! WARNING: Running tests in parallel on localhost:5000 can be un-reliable. \n" +
        "- does not allow the session cookie from the login Service to be set on each browser instance\n" +
        "- is difficult to debug\n" +
        "- increase sessionHijackOverrunTimeout may help  !!!\n" +
        "###################################################################################"
      );
    }
  }

  TestConfig.prototype.getAfterLaunch = function(cleanupAfterLaunch) {
    function afterLaunch() {

      // Cleanup the test config file when test is complete
      var testFile = path.join(__dirname, TEST_CONFIG_FILE_NAME);

      // Read the saved environment to get the logged in user and other config values
      var readConfig = JSON.parse(fs.readFileSync(testFile).toString());
      fs.unlinkSync(testFile);

      if (cleanupAfterLaunch) {
        if (readConfig.testUser) {
          //put in logout routine here
        }
      }
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ end Protractor tests ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

      if(readConfig.webReport) {

        return readReport().then(function(data){
          console.log(data);
        });

      }
    }
    return afterLaunch;
  };

  // This method only gets called once so it is useful for configuration that only needs to be done once such as login.
  TestConfig.prototype.getBeforeLaunch = function(loginBeforeLaunch, loginUsers, username, accountType, timestampExperiment, reporting) {
    var self = this;

    var beforeLaunchWithLogin = function() {
      var dfd = q.defer();
        if(reporting) {
            var api = new (require('../extensions/api.js'));
            //create the report file that tests will write to
            var file = fs.createWriteStream(__dirname + '/../../report/last_test_report.txt');
            file.end();

            api.updateSuiteRecord(reporting.webReport, reporting.testKey, {env: reporting.envRun, testNum: reporting.testNum});
        }
      var loginDfd;
      // Create a user that can be shared across tests if desired.  Tests do not
      // have to use this test user if it would impact the test results.
      //todo - solution for this? it used to deal with the login stuff we have from our test-data-service
      if (loginUsers) {
        loginDfd  ;
      } else {

      }
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Start Protractor tests ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      displayTestInfo(self.getConfig());
      q.all([loginDfd]).then(
        function(results) {
          var testFile = path.join(__dirname, TEST_CONFIG_FILE_NAME);
          var newConfig = {
            testUser: results[0]
          };
          self.updateConfig(newConfig);
          fs.writeFileSync(testFile, JSON.stringify(self.getConfig()));
          dfd.resolve();
        },
        function() {
          console.log("error");
        }
      );
      return dfd.promise;
    };

    var returnValue;
    if (loginBeforeLaunch) {
      returnValue = beforeLaunchWithLogin;
    } else {
      returnValue = function() {
        var dfd = q.defer();
          if(reporting) {
              var api = new (require('../extensions/api.js'));
              //create the report file that tests will write to
              var file = fs.createWriteStream(__dirname + '/../../report/last_test_report.txt');
              file.end();

              api.updateSuiteRecord(reporting.webReport, reporting.testKey, {env: reporting.envRun, testNum: reporting.testNum});
          }
        var testFile = path.join(__dirname, TEST_CONFIG_FILE_NAME);
        fs.writeFileSync(testFile, JSON.stringify(self.getConfig()));
        dfd.resolve();
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Start Protractor tests ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        displayTestInfo(self.getConfig());
        return dfd.promise;
      };
    }
    return returnValue;
  };

  TestConfig.prototype.getConfig = function() {
    return this.config;
  };

  TestConfig.prototype.updateConfig = function(config) {
    for (var key in config) {
      if (key !== 'devKey' && key !== 'sauceUser' && key !== 'sauceKey') {
        if(config.displayInfo) {
          console.log(key + ":" + config[key]);
        }
      }
      if (config.hasOwnProperty(key)) {
        this.config[key] = config[key];
      }
    }
  };

  TestConfig.prototype.getMultiCapabilities = function(sauceUser, environmentalComponents, maxProcesses, shardTestFiles, proxyUrl) {
    var multiCapabilities = [];
    var maxInstances;
    var tempEnvironment;
    var environment = [];
    var languages = this.getConfig().languages;

    if (typeof environmentalComponents == 'string') {
      tempEnvironment = JSON.parse(environmentalComponents);
    } else if (typeof environmentalComponents == 'object') {
      tempEnvironment = environmentalComponents;
    }

    //add the permutations of environments and languages
    if (languages) {
      tempEnvironment.forEach(function (capability) {
        environment = multiplexLanguages(capability, languages);
      });
    } else {
      environment = tempEnvironment;
    }

    if (environment && environment.length > 0) {
      environment.forEach(function(capability) {
        var tempObject = {};
        if (sauceUser) {
          tempObject['platform'] = capability.platform ? capability.platform : getRandomOS(capability.browserName);
          tempObject['browserName'] = capability.browserName ? capability.browserName : getRandomBrowser(tempObject.platform);
          tempObject['version'] = capability.version ? capability.version : "";
          tempObject['screen-resolution'] = getResolution(capability.screen_resolution, capability.platform);
        } else {
          tempObject['browserName'] = capability.browserName;
        }

        for (var key in capability) {
          if (capability.hasOwnProperty(key)) {
            if (key === 'platform' || key === 'browserName' || key === 'version' || key === 'screen-resolution') {
              continue;
            } else {
              tempObject[key] = capability[key];
            }
          }
        }
        multiCapabilities.push(tempObject);
      });
    }

    maxInstances = Math.ceil(maxProcesses / multiCapabilities.length);
    multiCapabilities.forEach(function(capability) {
      if (maxInstances) {
        capability.maxInstances = maxInstances;
      }
      if (shardTestFiles) {
        capability.shardTestFiles = shardTestFiles;
      }
      if (proxyUrl) {
        capability.proxy = {
          proxyType: "PAC",
          proxyAutoconfigUrl: proxyUrl
        };
      }
      capability.build = process.env.JOB_NAME || "NO_BUILD";
    });
    return multiCapabilities;
  };

  function multiplexLanguages(capability, languages) {
    var environmentList = [];
    var languageCodes;
    //console.log(languages);
    //if an array of language use it
    if(languages instanceof Array) {

      languageCodes = languages;

    } else { // user localeHelper to get language list
      languageCodes = localeHelper.getLanguages(languages);

      if(languages.multiplex) {
        languageCodes = multiplexOn(languages.multiplex, languageCodes);
      }
    }

    languageCodes.forEach(function (language) {
      var tempCapability = new Object();
      if(language.browserCode instanceof Array) {
          setChromeOptionAcceptLanguage(language.browserCode[0]);
      } else {
          setChromeOptionAcceptLanguage(language.browserCode);
      }
      for (var key in capability) {
        tempCapability[key] = capability[key];
      }
      tempCapability.language = language;
      environmentList.push(tempCapability);

      function setChromeOptionAcceptLanguage(browserCode){
        if (capability.browserName == 'chrome') {
          tempCapability['chromeOptions'] = {
            args: ['lang=' + browserCode],
            prefs: {
              intl: {
                accept_languages: browserCode
              }
            }
          };
        }
      }

    });
    return environmentList;
  }

  function multiplexOn(multiplex, languages) {
    var multiplexedCodes = [];
    if(multiplex == "nameForm") {
      languages.forEach(function (language) {
        language.nameForm.forEach(function (nameForm) {
          var variant = new Object();
          for (var key in language) {
              variant[key] = language[key];
          }
          variant.nameForm = [nameForm];
          multiplexedCodes.push(variant);
        });
      });
    } else if(multiplex == "browserCode") {
      languages.forEach(function (language) {
        language.browserCode.forEach(function (browserCode) {
          var variant = new Object();
          for (var key in language) {
            variant[key] = language[key];
          }
          variant.browserCode = [browserCode];
          multiplexedCodes.push(variant);
        });
      });
    }
    return multiplexedCodes;
  }

  TestConfig.prototype.getOnPrepare = function() {
    var self = this;
    var onPrepare = function() {
      return q.fcall(function() {

        // Allow remote file uploading
        var remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector);

        // Read the saved environment for this browser instance
        var testFile = path.join(__dirname, TEST_CONFIG_FILE_NAME);
        var readConfig = JSON.parse(fs.readFileSync(testFile).toString());
        self.updateConfig(readConfig);

        // store the environment on the global browser variable
        browser.testEnv = self.getConfig();

        // Don't allow the browser to hide areas that need to be accessible
        if(browser.testEnv.maximizeWindow) {
          browser.driver.manage().window().maximize();
        }
        // if true, ignore synchornization for testing non-angular pages.
        if(browser.testEnv.ignoreSynchronization === true) {
          browser.ignoreSynchronization = true;
        }
        // if we are using jasmine add custom reporters
        if(typeof jasmine !== "undefined") {
          addJasmineReporters(self.getConfig());
        }
      });
    };

    var afterLaunchLogin = function() {
      var dfd = q.defer();
      var loginDfd ; //todo - this normally got the OAUTH user, not in the opensource, what do we use here?
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Start Protractor tests ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

      q.all([loginDfd]).then(
        function(results) {
          var newConfig = {
            testUser: results[0]
          };
          self.updateConfig(newConfig);
            onPrepare();
          dfd.resolve();
        },
        function() {
          console.log("error");
        }
      );
      return dfd.promise;
    };

    var returnValue;
    if (self.loginAfterLaunch) {
      returnValue = afterLaunchLogin;
    } else {
      returnValue = onPrepare;
    }
    return returnValue;
  };
  return TestConfig;
})();

module.exports = TestConfig;

function addJasmineReporters(config) {
    var SpecReporter = require('jasmine-spec-reporter');
    //customProcessor that reports the first failure of each session to sauceLabs
    var DisplayProcessor = require('jasmine-spec-reporter/src/display-processor');
    var api = new(require('../extensions/api.js')); //to do sauce reporting
    var sauceReportProcessor = function(){};
    var sessionIds = [];
    sauceReportProcessor.prototype = new DisplayProcessor();
    //only modifies failure to upload to Sauce custom-data
    sauceReportProcessor.prototype.displayFailedSpec = function (spec, log) {
        if(config.sauceUser && config.sauceKey) {
            //api.putSauceCustomData(spec, config.sauceUser, config.sauceKey)
            browser.getSession().then(function(session) {
                var sessionId = session.getId();
                if(sessionIds.indexOf(sessionId) === -1) {
                    sessionIds.push(sessionId);
                    api.putSauceCustomData(spec, config.sauceUser, config.sauceKey, sessionId);
                }
            });
        }
        return log;
    };

    jasmine.getEnv().addReporter(new SpecReporter( {
        displayStacktrace: 'specs', // display stacktrace for each failed assertion, values: (all|specs|summary|none)
        displayFailuresSummary: true, // display summary of all failures after execution
        displayPendingSummary: true, // display summary of all pending specs after execution
        displaySuccessfulSpec: true, // display each successful spec
        displayFailedSpec: true, // display each failed spec
        displayPendingSpec: true, // display each pending spec
        displaySpecDuration: true, // display each spec duration
        displaySuiteNumber: true, // display each suite number (hierarchical)
        colors: {
            success: 'green',
            failure: 'red',
            pending: 'yellow'
        },
        prefixes: {
            success: '✓ ',
            failure: '✗ ',
            pending: '* '
        },
        customProcessors: [sauceReportProcessor]
    }));

    if(config.failFast) {
        //skip tests after first fail
        var specs = [];
        var orgSpecFilter = jasmine.getEnv().specFilter;
        jasmine.getEnv().specFilter = function (spec) {
            specs.push(spec);
            return orgSpecFilter(spec);
        };
        jasmine.getEnv().addReporter(new function () {
            this.specDone = function (result) {
                if (result.failedExpectations.length > 0) {
                    specs.forEach(function (spec) {
                        spec.disable()
                    });
                }
            };
        });
    }

    if (config.generateHtmlReport) {
        var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
        jasmine.getEnv().addReporter(new Jasmine2HtmlReporter( {
            savePath: './test/client/reports/',
            screenshotsFolder: 'images',
            takeScreenshots: true,
            takeScreenshotsOnlyOnFailures: true,
            consolidate: false,
            consolidateAll: false
        }));
    }

    if(config.webReport) {
        var reportServiceUp = true;
        var testId;
        var startedTime;
        var updateReport = {};
        var specList = [];
        var repo = 'blank';
        if(browser.testEnv.repository) {
            repo = browser.testEnv.repository.url;
        }

        var customReport = {

            suiteStarted: function(result) {
                startedTime = new Date().getTime();
                var report = {
                    runId: browser.testEnv.testKey,
                    testName: result.fullName,
                    startTime: new Date().getTime().toString(),
                    userName: process.env.USERNAME,
                    os: process.env.OS,
                    repository: repo,
                    runStatus: 'STARTED',
                    env: browser.testEnv.envRun
                };
                api.updateTestRecord(browser.testEnv.webReport,result.fullName + startedTime, report);
            },

            suiteDone: function(result) {


                if(!updateReport.runStatus) {
                  updateReport.runStatus = 'PASSED';
                }

                updateReport.testName = result.fullName;
                updateReport.steps = JSON.stringify(updateReport.steps);
                if(updateReport.steps) {
                  var formatedString = function(){
                      var fomattedStr = result.fullName + '|' + updateReport.runStatus + '\n';
                      var steparry = JSON.parse(updateReport.steps);
                      for(var i = 0; i< steparry.length; i++){
                          fomattedStr += '\t' + steparry[i].name + '\n';
                          fomattedStr += '\t\t' + steparry[i].failedExpect;

                      }
                      return fomattedStr;
                  }
                    fs.appendFile(__dirname + '/../../report/last_test_report.txt',
                    formatedString(),
                    function (err) {
                        if (err) throw err;
                    });
                }
                else{
                    fs.appendFile(__dirname + '/../../report/last_test_report.txt',
                        result.fullName + '|' + updateReport.runStatus + '\n',
                        function (err) {
                            if (err) throw err;
                        });
                }
                if(reportServiceUp) {

                    if(browser.testEnv.email) {
                        updateReport.email = browser.testEnv.email;
                    }
                    updateReport.endTime = new Date().getTime().toString();
                    api.updateTestRecord(browser.testEnv.webReport,result.fullName + startedTime, updateReport);
                }
            },

            specStarted: function(result) {

                    var spec = {
                        name: result.description,
                        runStatus: 'STARTED',
                        failedExpect:[]
                    };
                    specList.push(spec);

            },

            specDone: function (result) {

                    var specToUpdate = specList.pop();
                    if (result.status !== 'passed') {
                        if(!updateReport.steps) {
                            updateReport.steps = [];
                        }
                        //grab all the failed data - expectations and first line of the stack track:
                        for(var i = 0; i < result.failedExpectations.length; i++) {
                            var message = result.failedExpectations[i].message;


                            switch(true) {
                                case (message.indexOf('element not visible') !== -1):
                                    message = 'The Element is not visible.';
                                    break;
                                case (message.indexOf('No Element Found Using That Locator.') !== -1):
                                    message =  message.split(' at ')[0] ;
                                    break;
                                case (message.indexOf('element is not attached to the page document') !== -1):
                                    message =  'Stale Element Reference: The Element Is Not Attached To The Page Document.';
                                    break;
                                case (message.indexOf('session deleted because of page crash') !== -1):
                                    message =  'Unknown Err: Session Deleted Because Of Page Crash.';
                                    break;
                                case (message.indexOf('Element is not clickable at point') !== -1):
                                    message =  result.failedExpectations[i];
                                    break;
                                case (message.indexOf('"header":') !== -1):
                                    var subStr = message.substring(message.indexOf('{'), message.length);
                                    var json = JSON.parse(subStr);
                                    message =  (json.header.warning + ' | Status: ' + json.status);
                                    break;
                                default:
                                    var stackSplit = result.failedExpectations[i].stack.split(' at ');
                                    var collectedShared = '';
                                    for(var i=0; i< stackSplit.length; i++){
                                        if(stackSplit[i].indexOf('automation') !== -1){
                                            collectedShared += '\t\t\t\t'+stackSplit[i].trim() + '\n';
                                        }

                                    }
                                    if(collectedShared !== '') {
                                        message += '\n\t\t\tat:\n' + collectedShared;
                                    }
                                    else{
                                      message += '\n';
                                    }

                                    break;
                            }
                            specToUpdate.failedExpect.push(message);
                        }
                        specToUpdate.runStatus = 'FAILED';
                        updateReport.runStatus = 'FAILED';
                        updateReport.steps.push(specToUpdate);
                    } else {
                        specToUpdate.runStatus = 'PASSED';
                    }
                }

        };
        jasmine.getEnv().addReporter(customReport);
    }
}

function getBooleanFromString(stringValue) {
  var value;
  if (stringValue === 'true') {
    value = true;
  } else if (stringValue === 'false') {
    value = false;
  } else {
    throw ("value:" + stringValue + "must be true or false !!!");
  }
  return value;
}

function getStringFromCommandLine(commandLineVal) {
  var value;
  var commandSplit = commandLineVal.split('=');
  if (commandSplit && commandSplit.length === 2) {
    value = commandSplit[1];
  }
  return value;
}

function getJSONObjFromFilename(filename) {
  var jsonObjString = fs.readFileSync(filename, 'utf8');
  var jsonObject;
  if (jsonObjString) {
    jsonObject = JSON.parse(jsonObjString);
  }
  return jsonObject;
}

function getHelpString(defaultTestParameters) {
  var helpString = "Command Line Parameters - access in test through browser.params.[value]\n";
  var param;
  for (var key in defaultTestParameters) {
    if (defaultTestParameters.hasOwnProperty(key)) {
      param = defaultTestParameters[key];
      helpString += "--params." + key + "=" + param.value + " (" + param.description + ")\n";
    }
  }
  return helpString;
}

//get desired parts from json object, overwrite if necessary and return object.
//later items in options array get precedence.
function getWantedOptionsFromJSONObj(jsonObj, options) {
  var newConfig = jsonObj.default; //get the default part by default
  options.forEach(function(opt) {
    for (var key in jsonObj[opt]) {
      newConfig[key] = jsonObj[opt][key]; //insert option obj contents
    }
  });
  return newConfig
}


function addDefaultTestParametersToConfig(config, defaultTestParameters) {
  var param;
  for (var key in defaultTestParameters) {
    if (defaultTestParameters.hasOwnProperty(key)) {
      param = defaultTestParameters[key];
      config[key] = param.value;
    }
  }
}

//function processes config command line arguments after --params.config=.
//parts of files can be selected by using comma separated values.
//Valid commands include:
// protractor conf.js --params.config=local.json
//if SOME_FILE has "default", "sauce", "int" keys:
// protractor conf.js --params.config=SOME_FILE.json
// protractor conf.js --params.config=SOME_FILE.json,sauce
// protractor conf.js --params.config=SOME_FILE.json,sauce,int
//if a file path is passed into testConfig constructor and
//file has "default" and "sauce" keys:
// protractor conf.js --params.config=sauce
function updateConfigFromConfigFile(val, config) {
  var cmdLine = getStringFromCommandLine(val);
  var newConfig = 0;
  var jsonObj, key, i;
  cmdLine = cmdLine.split(',');
  if (cmdLine[0].indexOf('.json') > -1) { //if the first array item is json file
    jsonObj = getJSONObjFromFilename(cmdLine[0]);
    cmdLine.shift(); // get rid of json string in array
    if (jsonObj.hasOwnProperty('default')) { //new jsons have "default" key
      newConfig = getWantedOptionsFromJSONObj(jsonObj, cmdLine);
    } else { //old json. ex: local.json
      newConfig = jsonObj;
    }
  } else { //if the first item is not a json file
    //use the json file path passed through the constructor
    jsonObj = getJSONObjFromFilename(_configJsonPath);
    if (jsonObj.hasOwnProperty('default')) { //new jsons have "default" key
      newConfig = getWantedOptionsFromJSONObj(jsonObj, cmdLine); //items are options
    } else {
      console.log("ERROR: Invalid json object passed to constructor.");
    }
  }

  //add to or overwrite config items
  if (newConfig) {
    for (key in newConfig) {
      if (newConfig.hasOwnProperty(key)) {
        config[key] = newConfig[key];
      }
    }
  }
}

function addKeyValueToConfig(key, value, defaultTestParameters, config) {
  if (!defaultTestParameters.hasOwnProperty(key)) {
    console.log("### Warning: Argument(" + key + ") is not recognized and will be ignored unless used by a test. ###");
    config[key] = value;
  } else {
    switch (defaultTestParameters[key].type) {
      case "boolean":
        config[key] = getBooleanFromString(value);
        break;
      case "filename":
        config[key] = getJSONObjFromFilename(value);
        break;
      case 'Number':
        config[key] = Number(value);
        break;
      case "string":
      default:
        config[key] = value;
        break;
    }
  }
  config.summary += "--params." + key + "=" + value + "\n";
}

function updateConfigFromCmdLineArg(cmdLineArg, defaultTestParameters, config) {
  var value;
  var key;
  var prefixAndKey;
  var prefixKeyAndValue = cmdLineArg.split('=');
  if (prefixKeyAndValue.length === 2) {
    prefixAndKey = prefixKeyAndValue[0];
    value = prefixKeyAndValue[1];

    if (prefixAndKey.indexOf("--params.") === -1) {
      throw new Error("Command Line Argument(" + cmdLineArg + ") Missing --params prefix !!! ", cmdLineArg);
    }
    key = prefixAndKey.substr(9);
    addKeyValueToConfig(key, value, defaultTestParameters, config);
  } else if(cmdLineArg !== '--params.flake.retry' && cmdLineArg !== 'true'){//need to not check flake retry params
      throw new Error("Command Line Argument(" + cmdLineArg + ") missing '=' separator !!! ", cmdLineArg);
  }
}

function getConfigFromCommandLine(defaultTestParameters, cmdLineArgTesting) {

  var config = {
    summary: ""
  };
  var val;
  var argv = cmdLineArgTesting ? cmdLineArgTesting : process.argv;
  addDefaultTestParametersToConfig(config, defaultTestParameters);

  // find an instance of --params.config in the cmdLine arguments
  for (var i = 3; i < argv.length; i++) {
    if (argv[i].indexOf('-params.config') > -1){
      paramsConfigEncountered = true;
      break;
    }
  }

  //if json passed through constructor and --params.config wansn't found
  if (_configJsonPath && !paramsConfigEncountered)
    getConfigFromJSONArg(config);

  //process the cmdLine arguments in order
  for (var x = 3; x < argv.length; x++) {
    val = argv[x];
    if (val.indexOf('help') !== -1) {
      config.help = true;
      console.log(getHelpString(defaultTestParameters));
      break;
    } else if (val.indexOf('--specs') !== -1) {
      config.specs = argv[x + 1];
      x++;
    } else if (val.indexOf('config') !== -1) {
      updateConfigFromConfigFile(val, config);
    } else if(process.env.configParams !== undefined && process.env.configParams !== ''){
      updateConfigFromConfigFile('--params.config=' + process.env.configParams, config);
    } else {
      // handle all non - help parameters here
      updateConfigFromCmdLineArg(val, defaultTestParameters, config);
    }
  }
  return config;
}

//Gets the config from the JSON argument passed to constructor.
function getConfigFromJSONArg(config) {
  var newConfig;
  if(_configJsonPath.indexOf('.json') > -1) { //make sure it is a json file
    var jsonObj = getJSONObjFromFilename(_configJsonPath);
    if(jsonObj.hasOwnProperty("default")) { // the new type json file
      newConfig = jsonObj.default;
    } else {
      newConfig = jsonObj; //old type json file.
    }
    for (var key in newConfig) {
      if (newConfig.hasOwnProperty(key)) {
        config[key] = newConfig[key];
      }
    }
  }
  else
    console.log('ERROR: a non JSON filepath was passed to constructor.')
}

function displayTestInfo(config) {
  if(config.displayInfo) {
    console.log("### Protractor Command Line Parameters ###");
    console.log(config.summary);
    console.log("### ", config.protractorDirectory + " ###");
    console.log("suites:", config.suites);

    if (config.specs) {
      console.log("Re-run failed Specs:" + config.specs);
    }

    console.log("baseUrl:" + config.baseUrl + " dataCreationBaseHost:" + config.dataCreationBaseHost);
    if (config.runInParallel) {
      if (config.capabilities) {
        console.log("run suites in parallel with up to " + config.maxSessions + " Chome Browser Sessions");
      } else {
        console.log("run suites in parallel accross multiple browsers with up to " + config.maxSessions + " browser sessions of");
        config.multiCapabilities.forEach(function(capability) {
          console.log("  -- up to " + capability.maxInstances + " " + capability.browserName + " Browser Instances");
        });
      }
    } else {
      if (config.capabilities) {
        console.log("run suites in sequence within single Chrome browser session");
      } else {
        console.log("run suites in sequence accross browser session(s) of");
        config.multiCapabilities.forEach(function(capability) {
          console.log("  -- " + capability.browserName);
        });
      }
    }
    if (!config.sauceUser) {
      console.log("LOCAL Browsers seleniumAddress:", config.seleniumAddress);
    }

    if ((config.beforeLaunchLogin !== false)) {
      console.log("locale:" + config.locale + " login before browser launch");
    } else {
      console.log("locale:" + config.locale + " login after browser launch");
    }

    if (config.baseHost === "localhost:5000") {
      if (config.runInParallel) {
        console.log("sessionHijackOverrunTimeout:", config.sessionHijackOverrunTimeout);
      }
    }
    console.log("test TIMEOUT (jasmineNodeOpts.defaultTimeoutInterval):", config.jasmineNodeOpts.defaultTimeoutInterval);
    console.log("wait TIMEOUT:", config.waitTimeout);
  }
}

function getMochaOpts(params) {
  //set option specified in mochaOpts
  var mochaOpts = params.mochaOpts;
  //set defaults if not already set.
  var timeout = 90000;
  if (params.globalTimeout && params.globalTimeout > 90000) {
    timeout = params.globalTimeout;
  }
  if (typeof mochaOpts.useColors === "undefined") {
    mochaOpts.useColors = true;
  }
  if (typeof mochaOpts.fullTrace === "undefined") {
    mochaOpts.fullTrace = true;
  }
  mochaOpts.timeout = mochaOpts.timeout || timeout;
  mochaOpts.bail = mochaOpts.bail || params.failFast;
  mochaOpts.retries = mochaOpts.retries || params.retries;
  return mochaOpts;
}

function getJasmineNodeOpts(params) {
  var defaultTimeoutInterval = 90000;
  if (params.globalTimeout && params.globalTimeout > 90000) {
    defaultTimeoutInterval = params.globalTimeout;
  }

  var returnValue;
  if (params.testFilter == "all") {
    returnValue = {
      onComplete: null,
      isVerbose: true,
      showColors: true,
      includeStackTrace: true,
      defaultTimeoutInterval: 180000
    };
  } else {
    returnValue = {
      onComplete: null,
      isVerbose: true,
      showColors: true,
      includeStackTrace: true,
      defaultTimeoutInterval: defaultTimeoutInterval
    };
  }
  return returnValue;
}

function getOSBrowsers(os) {
  switch (os) {
    case 'Windows 10':
      return BrowsersForWindows10;
    case 'Windows 8.1':
      return BrowsersForWindows81;
    case 'Windows 8':
      return BrowsersForWindows8;
    case 'Windows 7':
      return BrowsersForWindows7;
    case 'Linux':
      return BrowsersForLinux;
    case 'OS X 10.11':
      return BrowsersForOSX1011;
    default:
      return AllSupportedBrowsers;
  }
}

function getRandomBrowser(os) {
  var browser = getOSBrowsers(os);
  return browser[Math.floor((Math.random() * browser.length))];
}

function getRandomOS(browser) {
  var os;
  switch (browser) {
    case 'chrome':
      os = OperatingSystemsThatSupportChrome;
      break;
    case 'firefox':
      os = OperatingSystemsThatSupportFirefox;
      break;
    case 'MicrosoftEdge':
      os = OperatingSystemsThatSupportMicrosoftEdge;
      break;
    case 'safari':
      os = OperatingSystemsThatSupportSafari;
      break;
    case 'internet explorer':
      os = OperatingSystemsThatSupportInternetExplorer;
      break;
    default:
      os = AllSupportedOperatingSystems;
  }
  return os[Math.floor((Math.random() * os.length))];
}

function getRandomResolution(os) {
  //as we progress with reactive design, we may add smaller resolutions, like '800x600', which is supported in Windows and OSx (but not Linux)
  var resolution = getOSBrowsers(os);
  return resolution[Math.floor((Math.random() * resolution.length))];
}

function checkScreenResolution(resolution, os) {
  var found, resPick;
  switch (os) {
    case 'Windows 10':
      found = ScreenResolutionForWindows10.indexOf(resolution);
      resPick = ScreenResolutionForWindows10;
      break;
    case 'Windows 8.1':
      found = ScreenResolutionForWindows81.indexOf(resolution);
      resPick = ScreenResolutionForWindows81;
      break;
    case 'Windows 8':
      found = ScreenResolutionForWindows8.indexOf(resolution);
      resPick = ScreenResolutionForWindows8;
      break;
    case 'Windows 7':
      found = ScreenResolutionForWindows7.indexOf(resolution);
      resPick = ScreenResolutionForWindows7;
      break;
    case 'OS X 10.11':
      found = ScreenResolutionForOSX1011.indexOf(resolution);
      resPick = ScreenResolutionForOSX1011;
      break;
    case 'Linux':
      found = ScreenResolutionForLinux.indexOf(resolution);
      resPick = ScreenResolutionForLinux;
      break;
    default:
      found = AllSupportedResolutions.indexOf(resolution);
      resPick = AllSupportedResolutions;
  }

  var returnValue;
  if (found > -1) {
    returnValue = resolution;
  } else {
    returnValue = resPick[Math.floor((Math.random() * resPick.length))];
  }
  return returnValue;
}

function getTestSuites(params) {
  var suites = {};
  var fileSuites;

  if (typeof params.suites === 'object') {
    fileSuites = params.suites;
  } else if (params.help) {
    suites = {
      empty: ['../../node_modules/automation-base/lib/config/empty_spec.js']
    };
  } else {
    var suitesParam = params.suites && params.suites.split('=');
    var suitesParamValues = suitesParam && (suitesParam.length === 1) && suitesParam[0].split(',');
    if (suitesParamValues && suitesParamValues.length > 0) {

      suitesParamValues.forEach(function(testSuiteFileName) {
        var fileSuiteString = fs.readFileSync(testSuiteFileName, 'utf8');
        if (fileSuiteString) {
          fileSuites = JSON.parse(fileSuiteString);
        }
      });
    }
  }

  if (fileSuites) {
    if (params.specs) {
      suites.failedTests = params.specs.split(",");
    } else {
      for (var key in fileSuites) {
        if (fileSuites.hasOwnProperty(key)) {
          if (!params.testFilter || (key.indexOf(params.testFilter) !== -1)) {
            suites[key] = fileSuites[key];
          }
        }
      }
    }
  }

  return suites;
}

function getResolution(resolution, os) {
  var pickedResolution;
  if (resolution && (resolution == "random")) {
    pickedResolution = getRandomResolution(os);
  } else if (resolution && (resolution !== "random")) {
    pickedResolution = checkScreenResolution(resolution, os);
  } else {
    pickedResolution = CommonResolutionToAll;
  }
  return pickedResolution;
}


var readReport = function(){
    var q = require('q');
    var dfd = q.defer();
  fs.readFile(__dirname + '/../../report/last_test_report.txt', 'utf8', function(err, data){
    if(err) dfd.resolve(err);
    dfd.resolve(data);
  });
    return dfd.promise;
};