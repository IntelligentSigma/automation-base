var LoginService = (function () {
  var q = require('q');
  var promise = require('promise');
  var superAgent = require('superagent');
  var agent = require('superagent-promise')(superAgent, promise);

  if (process.env.PROXY_PAC_URL) {
    require('proxy').applyProxy(superAgent);
  }

  function LoginService(config) {
    this.baseHost = config.dataCreationBaseHost;
    this.identHost = config.identHost;
    this.reference = config.reference;
    this.devKey = config.devKey;
    this.loginUsers = new (require('./loginUsers.js'))(config.loginUsers, config.loginUserKeyMap);
  }

  LoginService.prototype.setBaseHost = function (baseHost) {  this.baseHost = baseHost; };
  LoginService.prototype.setIdentHost = function (identHost) {  this.identHost = identHost; };
  LoginService.prototype.setDevKey = function (devKey) {  this.devKey = devKey; };

  return LoginService;
})();

module.exports = LoginService;

