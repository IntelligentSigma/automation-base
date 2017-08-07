var LoginService = (function () {
  var q = require('q');
  var promise = require('promise');
  var superAgent = require('superagent');
  var agent = require('superagent-promise')(superAgent, promise);

  if (process.env.PROXY_PAC_URL) {
    require('proxy').applyProxy(superAgent);
  }

  function LoginService(config) {
    this.baseHost = config.rootUrl;
    this.reference = config.reference;
    this.loginUsers = new (require('./loginUsers.js'))(config.loginUsers, config.loginUserKeyMap);
  }

  LoginService.prototype.setBaseHost = function (baseHost) {  this.baseHost = baseHost; };

  return LoginService;
})();

module.exports = LoginService;

