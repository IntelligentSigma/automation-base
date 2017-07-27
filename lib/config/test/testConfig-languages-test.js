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

var fileDir = './lib/config/test/configLanguages.json';
var configObj1 = JSON.parse(fs.readFileSync(fileDir, 'utf8'));

describe('testConfig languages function testing', function() {

    it('should work with language code array', function() {
        var cmdLineArgTesting = ['', '', '', '--params.config=languageArray'];
        var result = (new testConfig(__dirname, fileDir, cmdLineArgTesting)).getConfig();

        expect(result.multiCapabilities.length).to.equal(3, "should run the same tes 3 times one for each language");
    });

    it('should work with language object array', function() {
        var cmdLineArgTesting = ['', '', '', '--params.config=languageObjectArray'];
        var result = (new testConfig(__dirname, fileDir, cmdLineArgTesting)).getConfig();

        expect(result.multiCapabilities.length).to.equal(3, "should run the same tes 3 times one for each language");
    });

    it('should work with query object for localeHelper ', function() {
        var cmdLineArgTesting = ['', '', '', '--params.config=languageQuery'];
        var result = (new testConfig(__dirname, fileDir, cmdLineArgTesting)).getConfig();

        expect(result.multiCapabilities.length).to.greaterThan(1, "should find more than one language that core supports and is synotypic");
    });

    it('should work with query object for localeHelper multiplix on nameForm', function() {
        var cmdLineArgTesting = ['', '', '', '--params.config=multiplexNameForm'];
        var result = (new testConfig(__dirname, fileDir, cmdLineArgTesting)).getConfig();
        expect(result.multiCapabilities.length).to.greaterThan(1, "should find more than one capability");
        result.multiCapabilities.forEach(function (capability) {
            expect(capability.language.nameForm.length).to.equal(1, "NameForm is more than one " + capability.language.nameForm);
        });
    });

    it('should work with query object for localeHelper multiplix on browserCode', function() {
        var cmdLineArgTesting = ['', '', '', '--params.config=multiplexBrowserCode'];
        var result = (new testConfig(__dirname, fileDir, cmdLineArgTesting)).getConfig();

        expect(result.multiCapabilities.length).to.greaterThan(1, "should find more than one capability");
        result.multiCapabilities.forEach(function (capability) {
            expect(capability.language.browserCode.length).to.equal(1, "browserCode is more than one " + capability.language.browserCode);
        });
    });

});
