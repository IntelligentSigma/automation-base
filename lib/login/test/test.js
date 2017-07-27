// TODO replace with real tests
// Anticipate Tests for config, data creation and teardown, and login

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });

    it('should return 2', function(){
      assert.equal(2, [1,2,3].indexOf(3));
    });
  });
});
