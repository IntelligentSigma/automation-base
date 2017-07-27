var api = function () {
  var q = require('q');
  var promise = require('promise');
  var superAgent = require('superagent');
  var agent = require('superagent-promise')(superAgent, promise);

  if (process.env.PROXY_PAC_URL) {
    require('tf-proxy').applyProxy(superAgent);
  }

  api.prototype.putSauceCustomData = function(post_data, sUser, sKey, sessionID) {
    var dfd = protractor.promise.defer();
    var obj = {"custom-data" : post_data};
    var url = "https://" + sUser + ":" + sKey;
    url += "@saucelabs.com/rest/v1/" + sUser + "/jobs/";
    if(sessionID){
      url += sessionID;
      console.log('PUT Sauce custom-data.');
      // Set up the request
      agent
        .put(url)
        .send(obj)
        .set('Content-Type', 'application/json')
        .end(function(err){
          if(err)
            dfd.reject('error on put occured');
          else
            dfd.fulfill();
      });
    }
    else
    browser.getSession().then(function(session){
      url += session.getId();
      console.log('PUT Sauce custom-data.');
      // Set up the request
      agent
        .put(url)
        .send(obj)
        .set('Content-Type', 'application/json')
        .end(function(err){
          if(err)
            dfd.reject('error on put occured');
          else
            dfd.fulfill();
        });
      });
    return browser.wait(dfd.promise);
  };

  api.prototype.updateSuiteRecord = function(suiteId, uniqueId, envToSend){
      var dfd = q.defer();
      agent
          .post('https://ah7l9shm97.execute-api.us-east-1.amazonaws.com/matai/updatesuitetime/'+
              encodeURIComponent(suiteId)+'/'+encodeURIComponent(uniqueId))
          .send(JSON.parse(JSON.stringify(envToSend)))
          .set('Content-Type', 'application/json')
          .end(function(err, res){
              if(err){
                  console.log('the reporting service is having problems, will not update this suite');
                  dfd.resolve('offline');
              }
              else{
                  dfd.resolve(res);
              }
          });
      return dfd.promise;
  };

  api.prototype.updateTestRecord = function(suiteId, uniqueId, updateJson){
      var dfd = q.defer();
      agent
          .post('https://ah7l9shm97.execute-api.us-east-1.amazonaws.com/matai/testupdate/' +
              encodeURIComponent(suiteId) + '/' + encodeURIComponent(uniqueId))
          .send(JSON.parse(JSON.stringify(updateJson)))
          .set('Content-Type', 'application/json')
          .end(function (err, res) {
              if (err) {
                  console.log(errorMessage);
                  dfd.resolve('offline');
              }
              else {
                  dfd.resolve(res);
              }
          });
      return dfd.promise;
  }
};

module.exports = api;

