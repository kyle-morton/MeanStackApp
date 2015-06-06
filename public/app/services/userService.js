angular.module('userService', [])


//REM: this factory just like EJB
//just a pass thru to our API
.factory('User', function($http) {

   //create userFactory object
   var userFactory = {};

   // get a single user
   //REM: return object is promise object
  userFactory.get = function(id) {
    return $http.get('/api/users/' + id);
  };
  // get all users
  userFactory.all = function() {
    return $http.get('/api/users/');
  };
  // create a user
  userFactory.create = function(userData) {
    return $http.post('/api/users/', userData);
  };
  // update a user
  userFactory.update = function(id, userData) {
    return $http.put('/api/users/' + id, userDat
  };
  // delete a user
  userFactory.delete = function(id) {
    return $http.delete('/api/users/' + id);
  };

  //return the factory object with the
  //the calls to API
  return userFactory;

});
