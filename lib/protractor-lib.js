var ProtractorLib = (function () {
  function ProtractorLib() {
    var chai = require('chai');
    chai.config.includeStack = true;
    var chaiAsPromised = require('chai-as-promised');

    chai.use(chaiAsPromised);
    this.expect = chai.expect;
  }

  ProtractorLib.prototype.loginService = new (require('./login/loginService.js'))(browser.testEnv);
  ProtractorLib.prototype.loginUsers = new (require('./login/loginUsers.js'));
  ProtractorLib.prototype.cookieUtils = new (require('./extensions/cookieUtils.js'));
  ProtractorLib.prototype.env = browser.testEnv;
  ProtractorLib.prototype.expect = this.expect;
  ProtractorLib.prototype.TIMEOUT = browser.testEnv.waitTimeout;
  ProtractorLib.prototype.chance = require('chance').Chance(Math.floor((Math.random() * 1000000) + 1));

  return ProtractorLib;

})();

module.exports = ProtractorLib;