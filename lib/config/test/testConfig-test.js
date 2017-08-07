// Anticipate Tests for config, data creation and teardown, and login

var testConfig = require('../testConfig.js'),
  fs = require("fs"),
  chai = require('chai'),
  sinonChai = require('sinon-chai'),
  sinon = require('sinon'),
  q = require('q'),
  should = chai.should(),
  expect = chai.expect;

chai.use(sinonChai);

var fileDir1 = './lib/config/test/config.json';
var fileDir2 = './lib/config/test/config2.json';
var fileDir3 = './lib/config/test/oldConfig.json';
var configObj1 = JSON.parse(fs.readFileSync(fileDir1, 'utf8'));
var configObj2 = JSON.parse(fs.readFileSync(fileDir2, 'utf8'));
var configObj3 = JSON.parse(fs.readFileSync(fileDir3, 'utf8'));


describe('testConfig function testing', function(){
  var tcObj = new testConfig(__dirname, './lib/config/test/config.json');


  describe('#getAfterLaunch()', function(){
    var ret = tcObj.getAfterLaunch();

    it('should return a function', function(){
      ret.should.be.a('function');
    });
  });

  describe('#getBeforeLaunch()', function(){
    var ret = tcObj.getBeforeLaunch();

    it('should return a function', function(){
      ret.should.be.a('function');
    });
  });

  describe('#getConfig()', function(){
    var ret = tcObj.getConfig();

    it('should return an object', function(){
      ret.should.be.a('object');
    });

    it('should contain all the default testParameters', function(done){
      var testParameters = [
        'afterLaunchLogin', 'app', 'baseHost', 'beforeLaunchLogin',
        'dataCreationBaseHost', 'environment', 'experimentList',
        'generateHTMLReport', 'globalTimeout', 'locale', 'location',
        'loginUserKeyMap', 'loginUsers', 'maxThreads', 'proxyUrl', 'runInParallel',
        'sauceKey', 'sauceUser', 'suites', 'testFilter',
        'username', 'waitTimeout'
      ];

      var result;

      function checkAll(idx){
        if(idx > -1){
          result = ret.hasOwnProperty(testParameters[idx]);
          result.should.equal(true);
          checkAll(idx - 1);
        } else {
          done();
        }
      } 

      checkAll(testParameters.length - 1);
    });
  });

  describe('#getDataCreationBaseHost()', function(){

    it('should return undefined when given no arguments', function(){
      var result = tcObj.getDataCreationBaseHost();
      should.not.exist(result);
    });

    it('should return the string it is given as arg 1', function(){
      var dataCreationBaseHost = 'I am the data creation basehost';
      var result = tcObj.getDataCreationBaseHost(dataCreationBaseHost, 'arg2');
      result.should.equal(dataCreationBaseHost);
    });

    it('should return integration reference when given localhost:5000 arg2', function(){
      var result = tcObj.getDataCreationBaseHost(null, 'localhost:5000');
      result.should.equal('google.com');
    });

    it('should otherwise return the string passed to it as arg2', function(){
      var someString = 'I am some string';
      var result = tcObj.getDataCreationBaseHost(null, someString);
      result.should.equal(someString);
    });
  });

  describe('#getMultiCapabilities()', function(){

     it('should return an array', function(){
       var result = tcObj.getMultiCapabilities();
       result.should.be.a('array');
     });
  });


  describe('#getOnPrepare()', function(){

    it('should return a function when no arguments are passed', function(){
      var result = tcObj.getOnPrepare();
      result.should.be.a('function');
    });

    it('should return a function when arg1 is true', function(){
      var result = tcObj.getOnPrepare(true);
      result.should.be.a('function');
    });

    it('should return a function when arg2 is true', function(){
      var result = tcObj.getOnPrepare(false, true);
      result.should.be.a('function');
    });

  });


  describe('#updateConfig()', function(){
    it('should return no value', function(done){
      should.not.exist(tcObj.updateConfig());
      done();
    });

    it('should allow adding new properties to config object', function(done){
      var tempTcObj = new testConfig(__dirname, './lib/config/test/config.json');
      var newConfig = { 'test123': 'test', 'test456': 'test'};
      var beforeSize = Object.keys(tempTcObj.getConfig()).length;
      tempTcObj.updateConfig(newConfig);
      var afterSize = Object.keys(tempTcObj.getConfig()).length;
      afterSize.should.be.equal(beforeSize + 2);
      done();
    });

    it('should overwrite existing properties', function(done){
      var tempTcObj = new testConfig(__dirname, './lib/config/test/config.json');
      var newConfig = { 'app': 'It is over 9000!'};
      var beforeConfig = tcObj.getConfig();
      var beforeConfigSize = Object.keys(beforeConfig).length;
      tempTcObj.updateConfig(newConfig);
      var afterConfig = tempTcObj.getConfig();
      var afterConfigSize = Object.keys(afterConfig).length;
      beforeConfigSize.should.be.equal(afterConfigSize);
      beforeConfig.app.should.not.be.equal(afterConfig.app);
      done();
    });

    it('should not allow overwriting sauceUser, nor sauceKey properties', function(done){
      var tempTcObj = new testConfig(__dirname, './lib/config/test/config.json');
      var newConfig = {'sauceUser': 'test', 'sauceKey': 'test'};
      var beforeConfig = tempTcObj.getConfig();
      tempTcObj.updateConfig(newConfig);
      var afterConfig = tempTcObj.getConfig();
      beforeConfig.sauceUser.should.be.equal(afterConfig.sauceUser);
      beforeConfig.sauceKey.should.be.equal(afterConfig.sauceKey);
      done();
    });

  });

});


describe('testConfig black box testing', function(){
  it('should accept old type JSON config files through constructor', function(done){
    var result = new testConfig(__dirname, fileDir3).getConfig();
    var keys = Object.keys(configObj3);

    function checkAll(idx){
      if(idx > -1) {
        configObj3[keys[idx]].should.eql(result[keys[idx]]);
        checkAll(idx - 1);
      } else {
        done();
      }
    }

    checkAll(keys.length - 1);

  });

  it('should return default test parameters when given no args', function(done){
    var result = new testConfig(__dirname).getConfig();
    var expectedResult = {
      summary: '',
      app: '',
      afterLaunchLogin: false,
      baseHost: 'localhost:5000',
      beforeLaunchLogin: true,
      environment: '[{"browserName":"chrome"}]',
      generateHTMLReport: undefined,
      globalTimeout: 60000,
      waitTimeout: 60000,
      locale: 'en',
      location: 'LOCAL',
      loginUsers: undefined,
      loginUserKeyMap: undefined,
      maxThreads: '10',
      proxyUrl: undefined,
      runInParallel: true,
      sauceUser: undefined,
      sauceKey: undefined,
      suites: {},
      testFilter: undefined,
      experimentList: undefined,
      username: undefined,
      //afterLaunch: Function,
      rootUrl: 'http://localhost:5000',
      baseUrl: 'http://localhost:5000/',
      seleniumAddress: 'http://localhost:4444/wd/hub',
      sessionHijackOverrunTimeout: 1000,
      maxSessions: '10',
      multiCapabilities:
       [ { browserName: 'chrome',
           maxInstances: 10,
           shardTestFiles: true,
           build: 'NO_BUILD' } ],
      jasmineNodeOpts:
       { onComplete: null,
         isVerbose: true,
         showColors: true,
         includeStackTrace: true,
         defaultTimeoutInterval: 90000 }
      //beforeLaunch: Function,
      //onPrepare: Function
     };
     var keys = Object.keys(expectedResult);
   
    function checkAll(idx){
      if(idx > -1){
        if(keys[idx] != 'sauceUser' && keys[idx] != 'sauceKey' && expectedResult[keys[idx]] != null){
          expectedResult[keys[idx]].should.eql(result[keys[idx]]);
        }
        checkAll(idx - 1);
      } else {
        done();
      }
    }

    checkAll(keys.length - 1);

  });

  it('should have default from newer JSON when no options are specified in cmd line', function(done){
    var result = new testConfig(__dirname, fileDir1).getConfig();
    var keys = Object.keys(configObj1.default);

    function checkAll(idx){
      if(idx > -1){
        configObj1.default[keys[idx]].should.eql(result[keys[idx]]);
        checkAll(idx - 1);
      } else {
        done();
      }
    }

    checkAll(keys.length - 1);   
  });

  it('should have default and sauce when given --params.config=sauce', function(done){
        var cmdLineArgTesting = ['', '', '','--params.config=sauce']
        var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();
        var dKeys = Object.keys(configObj1.default);
        var sKeys = Object.keys(configObj1.sauce);

        
        function checkAll(idx){
          //first check the defaults
          if(idx > -1){
            configObj1.default[dKeys[idx]].should.eql(result[dKeys[idx]]);
            checkAll(idx - 1);
          } else {

            function checkSauce(idx){
              if(idx > -1){
                if(sKeys[idx] != 'sauceUser' && sKeys[idx] != 'sauceKey' ){
                  configObj1.sauce[sKeys[idx]].should.equal(result[sKeys[idx]]);
                }
                checkSauce(idx - 1);
              } else {
                done();
              }
            }

            checkSauce(sKeys.length - 1);
          }
        }

        checkAll(dKeys.length - 1);

  
  });

  it('should overwrite options passed through cmd line', function(done){
    var cmdLineArgTesting = ['', '', '','--params.config=int']
    var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();

    var baseHost = "google.com";

    result.baseHost.should.equal(configObj1.int.baseHost);
    done();
  });


  it('should accept old type JSON config files through cmd line', function(done){
    var cmdLineArgTesting = ['', '', '','--params.config='+fileDir3];
    var result = new testConfig(__dirname, null, cmdLineArgTesting).getConfig();
    var keys = Object.keys(configObj3);

    function checkAll(idx){
      if(idx > -1){
        configObj3[keys[idx]].should.eql(result[keys[idx]]);
        checkAll(idx - 1);
      } else {
        done();
      }
    }

    checkAll(keys.length - 1);
  });


  it('should give precedence to command line path over constructor path', function(done){
    var cmdLineArgTesting = ['', '', '','--params.config='+fileDir1]
    var result = new testConfig(__dirname, fileDir2, cmdLineArgTesting).getConfig();

    var keys = Object.keys(configObj1.default);

    function checkAll(idx){
      if(idx > -1){
        configObj1.default[keys[idx]].should.eql(result[keys[idx]]);
        checkAll(idx - 1);
      } else {
        done();
      }
    }

    checkAll(keys.length - 1);

  });

  it('should completely ignore the constructor directory if one is given in cmd line', function(done){
    var badFileDir = 'this is obviously a valid directory';
    var cmdLineArgTesting = ['', '', '','--params.config='+fileDir1]
    var result = new testConfig(__dirname, badFileDir, cmdLineArgTesting).getConfig();
    var keys = Object.keys(configObj1.default);

    function checkAll(idx){
      if(idx > -1){
        configObj1.default[keys[idx]].should.eql(result[keys[idx]]);
        checkAll(idx - 1);
      } else {
        done();
      }
    }

    checkAll(keys.length - 1);
  });


  it('should accept both a path and options in the command line', function(done){
    var cmdLineArgTesting = ['', '', '','--params.config='+fileDir1+',inDev,int'];
    var result = new testConfig(__dirname, null, cmdLineArgTesting).getConfig();

    configObj1.inDev.suites.should.eql(result.suites);
    configObj1.inDev.environment.should.eql(result.environment);
    configObj1.int.baseHost.should.equal(result.baseHost);
    done();  
  });

  it('should accept "environment" as an object', function(done){
    var cmdLineArgTesting = ['', '', '','--params.config=envObj'];
    var result = (new testConfig(__dirname, fileDir1, cmdLineArgTesting)).getConfig();

    configObj1.envObj.environment[0].should.be.a('object');
    configObj1.envObj.environment[0].browserName
    .should.equal(result.multiCapabilities[0].browserName);
    done();
  });

  it('should allow changing the accountType', function(){
    var cmdLineArgTesting = ['', '', '','--params.config=pubAcct'];
    var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();

    result.accountType.should.equal(configObj1.pubAcct.accountType); // 'PUBLIC'
  });

  describe('with additional "--params.globalTimeout=9999 --params.runInParallel=false" cmd line argument', function(){

    xit('should accept old type JSON config files through constructor', function(done){
      var cmdLineArgTesting = ['', '', '','--params.globalTimeout=9999', '--params.runInParallel=false'];
      var result = new testConfig(__dirname, fileDir3, cmdLineArgTesting).getConfig();
      var keys = Object.keys(configObj3);
      console.log(configObj3);
      console.log(result);
      function checkAll(idx){
        if(idx > -1){
          if(keys[idx] != 'runInParallel' && keys[idx] != 'globalTimeout')
            configObj3[keys[idx]].should.eql(result[keys[idx]]);
          checkAll(idx - 1);
        } else {
          done();
        }
      }

      result.globalTimeout.should.be.equal(9999);
      result.runInParallel.should.equal(false);
      checkAll(keys.length - 1);
    });

    it('should return default test parameters when given no args', function(done){
      var cmdLineArgTesting = ['', '', '','--params.globalTimeout=9999', '--params.runInParallel=false'];

      var result = new testConfig(__dirname, null, cmdLineArgTesting).getConfig();
      var expectedResult = {
        app: '',
        afterLaunchLogin: false,
        baseHost: 'localhost:5000',
        beforeLaunchLogin: true,
        environment: '[{"browserName":"chrome"}]',
        generateHTMLReport: undefined,
        globalTimeout: 9999, //This matches the cmdLine argument
        waitTimeout: 60000,
        locale: 'en',
        location: 'LOCAL',
        loginUsers: undefined,
        loginUserKeyMap: undefined,
        maxThreads: '10',
        proxyUrl: undefined,
        runInParallel: false, //This matches the cmdLine argument
        sauceUser: undefined,
        sauceKey: undefined,
        suites: {},
        testFilter: undefined,
        username: undefined,
        //afterLaunch: Function,
        rootUrl: 'http://localhost:5000',
        baseUrl: 'http://localhost:5000/',
        seleniumAddress: 'http://localhost:4444/wd/hub',
        sessionHijackOverrunTimeout: 1000,
        //maxSessions: '10',
        // multiCapabilities:
        //  [ { browserName: 'chrome',
        //      maxInstances: 10,
        //      shardTestFiles: true,
        //      build: 'NO_BUILD' } ],
        jasmineNodeOpts:
         { onComplete: null,
           isVerbose: true,
           showColors: true,
           includeStackTrace: true,
           defaultTimeoutInterval: 90000 }
        //beforeLaunch: Function,
        //onPrepare: Function
       };

     var keys = Object.keys(expectedResult);
   
    function checkAll(idx){
      if(idx > -1){
        if(keys[idx] != 'sauceUser' && keys[idx] != 'sauceKey' && expectedResult[keys[idx]] != null)
          expectedResult[keys[idx]].should.eql(result[keys[idx]]);
        checkAll(idx - 1);
      } else {
        done();
      }
    }

    checkAll(keys.length - 1);
    });

    xit('should have default from newer JSON when no options are specified in cmd line', function(done){
      var cmdLineArgTesting = ['', '', '','--params.globalTimeout=9999', '--params.runInParallel=false'];

      var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();
      var keys = Object.keys(configObj1.default);

      function checkAll(idx){
        if(idx > -1){
          if(keys[idx] != 'runInParallel' && keys[idx] != 'globalTimeout')
            configObj1.default[keys[idx]].should.eql(result[keys[idx]]);
          checkAll(idx - 1);
        } else {
          done();
        }
      }

      result.globalTimeout.should.be.equal(9999);
      result.runInParallel.should.equal(false);
      checkAll(keys.length - 1);
    });

    it('should have default and sauce when given --params.config=sauce', function(done){
      var cmdLineArgTesting = ['', '', '','--params.config=sauce',
        '--params.globalTimeout=9999', '--params.runInParallel=false'];
      var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();
      var dKeys = Object.keys(configObj1.default);
      var sKeys = Object.keys(configObj1.sauce);


      function checkAll(idx){
        //first check the defaults
        if(idx > -1){
          if(dKeys[idx] != 'runInParallel' && dKeys[idx] != 'globalTimeout')
            configObj1.default[dKeys[idx]].should.eql(result[dKeys[idx]]);
          checkAll(idx - 1);
        } else {

          function checkSauce(idx){
            if(idx > -1){
              if(sKeys[idx] != 'sauceUser' && sKeys[idx] != 'sauceKey' )
                configObj1.sauce[sKeys[idx]].should.equal(result[sKeys[idx]]);
              checkSauce(idx - 1);
            } else {
              done();
            }
          }

          checkSauce(sKeys.length - 1);
        }
      }
      result.globalTimeout.should.equal(9999);
      result.runInParallel.should.equal(false);
      checkAll(dKeys.length - 1);

    });

    it('should overwrite options passed through cmd line', function(done){
      var cmdLineArgTesting = ['', '', '','--params.config=int',
        '--params.globalTimeout=9999', '--params.runInParallel=false'];
      var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();

      result.baseHost.should.equal(configObj1.int.baseHost);
      result.globalTimeout.should.be.equal(9999);
      result.runInParallel.should.equal(false);
      done();
    });

    it('should accept old type JSON config files through cmd line', function(done){
      var cmdLineArgTesting = ['', '', '','--params.config='+fileDir3,
        '--params.globalTimeout=9999', '--params.runInParallel=false'];
      var result = new testConfig(__dirname, null, cmdLineArgTesting).getConfig();

      var keys = Object.keys(configObj3);

      function checkAll(idx){
        if(idx > -1){
          if(keys[idx] != 'runInParallel' && keys[idx] != 'globalTimeout')
            configObj3[keys[idx]].should.eql(result[keys[idx]]);
          checkAll(idx - 1);
        } else {
          done();
        }
      }

      result.globalTimeout.should.be.equal(9999);
      result.runInParallel.should.equal(false);
      checkAll(keys.length - 1);
    });


    it('should give precedence to command line path over constructor path', function(done){
      var cmdLineArgTesting = ['', '', '','--params.config='+fileDir1,
        '--params.globalTimeout=9999', '--params.runInParallel=false'];
      var result = new testConfig(__dirname, fileDir2, cmdLineArgTesting).getConfig();

      var keys = Object.keys(configObj1.default);
      function checkAll(idx){
        if(idx > -1){
          if(keys[idx] != 'runInParallel' && keys[idx] != 'globalTimeout')
            configObj1.default[keys[idx]].should.eql(result[keys[idx]]);
          checkAll(idx - 1);
        } else {
          done();
        }
      }

      result.globalTimeout.should.be.equal(9999);
      result.runInParallel.should.equal(false);
      checkAll(keys.length - 1);
    });

    it('should completely ignore the constructor directory if one is given in cmd line', function(done){
      var badFileDir = 'this is obviously a valid directory';
      var cmdLineArgTesting = ['', '', '','--params.config='+fileDir1,
        '--params.globalTimeout=9999', '--params.runInParallel=false'];
      var result = new testConfig(__dirname, badFileDir, cmdLineArgTesting).getConfig();

      var keys = Object.keys(configObj1.default);
      function checkAll(idx){
        if(idx > -1){
          if(keys[idx] != 'runInParallel' && keys[idx] != 'globalTimeout')
            configObj1.default[keys[idx]].should.eql(result[keys[idx]]);
          checkAll(idx - 1);
        } else {
          done();
        }
      }

      result.globalTimeout.should.be.equal(9999);
      result.runInParallel.should.equal(false);
      checkAll(keys.length - 1);
    });


    it('should accept both a path and options in the command line', function(done){
      var cmdLineArgTesting = ['', '', '','--params.config='+fileDir1+',inDev,int',
        '--params.globalTimeout=9999', '--params.runInParallel=false'];
      var result = new testConfig(__dirname, null, cmdLineArgTesting).getConfig();

      configObj1.inDev.suites.should.eql(result.suites);
      configObj1.inDev.environment.should.eql(result.environment);
      configObj1.int.baseHost.should.equal(result.baseHost);
      result.globalTimeout.should.be.equal(9999);
      result.runInParallel.should.equal(false);
      done()
    });

  });

  describe('test with --specs', function(){
    it('should return default test parameters and specs', function(done){
      var specs = 'tests/directory/test1.js,tests/directory/test2.js';
      var cmdLineArgTesting = ['', '', '','--specs', specs];

      var result = new testConfig(__dirname, null, cmdLineArgTesting).getConfig();
      var expectedResult = {
        summary: '',
        app: '',
        afterLaunchLogin: false,
        baseHost: 'localhost:5000',
        beforeLaunchLogin: true,
        environment: '[{"browserName":"chrome"}]',
        globalTimeout: 60000,
        waitTimeout: 60000,
        locale: 'en',
        location: 'LOCAL',
        maxThreads: '10',
        runInParallel: true,
        specs: 'tests/directory/test1.js,tests/directory/test2.js',
        suites: {},
        rootUrl: 'http://localhost:5000',
        baseUrl: 'http://localhost:5000/',
        seleniumAddress: 'http://localhost:4444/wd/hub',
        sessionHijackOverrunTimeout: 1000,
        maxSessions: '10',
        multiCapabilities:
         [ { browserName: 'chrome',
             maxInstances: 10,
             shardTestFiles: true,
             build: 'NO_BUILD' } ],
        jasmineNodeOpts:
         { onComplete: null,
           isVerbose: true,
           showColors: true,
           includeStackTrace: true,
           defaultTimeoutInterval: 90000 }
       };

      var keys = Object.keys(expectedResult);
   
      function checkAll(idx){
        if(idx > -1){
          if(keys[idx] != 'sauceUser' && keys[idx] != 'sauceKey' )
            expectedResult[keys[idx]].should.eql(result[keys[idx]]);
          checkAll(idx - 1);
        } else {
          done();
        }
      }

      checkAll(keys.length - 1);
    });

    xit('should have default from newer JSON + specs', function(done){
      var spec1 = 'tests/directory/test1.js';
      var spec2 = 'tests/directory/test2.js';
      var cmdLineArgTesting = ['', '', '','--specs', spec1+','+spec2];
      var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();

      var keys = Object.keys(configObj1.default);

      function checkAll(idx){
        if(idx > -1){
          if(keys[idx] != 'suites'){
            console.log(keys[idx]);
            configObj1.default[keys[idx]].should.eql(result[keys[idx]]);
          }
          checkAll(idx - 1);
        } else {
          done();
        }
      }

      result.suites.failedTests.should.contain(spec1);
      result.suites.failedTests.should.contain(spec2);
      checkAll(keys.length - 1);
    });

  describe('With cbt', function(){

    it('should show the cbt needed items when requested', function(){
      var  multiCapabilities= { 
        screen_resolution:"1024x768",
        browserName:"firefox",
        build:"NO_BUILD",
        shardTestFiles: true,
        name:"FF browser",
        maxInstances: 10,
        browser_api_name:"FF45",
        os_api_name:"Win7x64-C1",
        record_video:"true",
        record_network:"true",
        record_snapshot:"true",
        username:"someone@gmail.com",
        password:"password"
      };
      var seleniumAddress = "http://STUFF@hub.crossbrowsertesting.com:80/wd/hub";


      var cmdLineArgTesting = ['', '', '','--params.config=cbt'];
      var result = new testConfig(__dirname, fileDir1, cmdLineArgTesting).getConfig();
      var keys = Object.keys(multiCapabilities);
      
      multiCapabilities.should.eql(result.multiCapabilities[0]);  
      result.seleniumAddress.should.equal(seleniumAddress);
    });
  });

});
});