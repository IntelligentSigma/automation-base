var LoginUsers = (function() {
  function LoginUsers(loginUsers, loginUserKeyMap) {
    this.loginUsers = loginUsers || [];
    this.loginUsersKeyMap  = loginUserKeyMap || {};
  }

  LoginUsers.prototype.setLoginUsers = function (loginUsers) {
    this.loginUsers = loginUsers;
  };

  LoginUsers.prototype.setLoginUsersKeyMap = function (loginUsersKeyMap) {
    this.loginUsersKeyMap = loginUsersKeyMap;
  };

  /**
   *  Randomly SELECT user to login as.
   *
   */
  LoginUsers.prototype.getRandomUser = function () {
    if (!this.loginUsers || this.loginUsers.length === 0) {
      throw new Error("There are no login users.  You must supply them using the --params.loginUsers=[loginUsers.json] option !!!");
    }
    var num = Math.floor(Math.random() * this.loginUsers.length);
    return  this.loginUsers[num];
  };


  LoginUsers.prototype.getLoginUser = function (username) {
    if (!this.loginUsers || this.loginUsers.length === 0) {
      throw new Error("There are no login users.  You must supply them using the --params.loginUsers=[loginUsers.json] option !!!");
    }
    var loginUser = undefined;
    if (username) {
      for (var i = 0; i < this.loginUsers.length; i++) {
        if (this.loginUsers[i].username === username) {
          loginUser = this.loginUsers[i];
          break;
        }
      }

      if (!loginUser) {
        throw new Error('A login User with that username is not in your list of login Users !!!')
      }

    } else {
      loginUser = this.getRandomUser();
    }
    return loginUser;
  };

  LoginUsers.prototype.getLoginUserByKey = function (key) {

    if (!this.loginUsersKeyMap || !this.loginUsersKeyMap[key]) {
      throw new Error('A login User with that key is not in your login users Key Map !!!')
    }

    return this.loginUsersKeyMap[key];
  };

  return LoginUsers;

})();

module.exports = LoginUsers;
