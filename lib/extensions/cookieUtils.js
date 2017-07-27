/**
 * Created by kaicolo on 3/11/2016.
 */
var cookieUtils = (function () {

  function cookieUtils(){

  }

  cookieUtils.prototype.setCookie = function(name, value){
    browser.manage().addCookie({name:name, value:value});
  };

  cookieUtils.prototype.getCookie = function(name){
    return browser.manage().getCookie(name);
  };

  cookieUtils.prototype.deleteCookie = function(name){
    return browser.manage().deleteCookieNamed(name);
  };

  return cookieUtils;
})();

module.exports = cookieUtils;
