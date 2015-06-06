angular.module('authService', [])



    // ===================================================
    // auth factory to login and get information
    // inject $http for communicating with the API
    // inject $q to return promise objects
    // inject AuthToken to manage tokens
    // ===================================================
    .factory('Auth', function($http, $q, AuthToken) {
      // create auth factory object
      var authFactory = {};

      // handle login
      authFactory.login = function(username, password) {
        // return the promise object and its data
        return $http.post('/api/authenticate', {
          username: username,
          password: password
        }) //if successful -> set token using other factory
        .success(function(data) {
          AuthToken.setToken(data.token);
          return data;
        });
      };

      // handle logout
      // log a user out by clearing the token
      authFactory.logout = function() {
        // clear the token
        AuthToken.setToken();
      };

      // check if a user is logged in
      // checks if there is a local token
      // in LOCAL browsers cache
      authFactory.isLoggedIn = function() {
          if (AuthToken.getToken())
            return true;
          else
            return false;
      };

      // get the user info
      // get the logged in user
      authFactory.getUser = function() {
        if (AuthToken.getToken())
          return $http.get('/api/me');
        else
          return $q.reject({ message: 'User has no token.' });
      };

      // return auth factory object
      return authFactory;
    })


    // ===================================================
    // factory for handling tokens
    // inject $window to store token client-side
    // ===================================================
    .factory('AuthToken', function($window) {
        var authTokenFactory = {};

        // get the token out of local storage (BROWSER)
        authTokenFactory.getToken = function () {
            return $window.localStorage.getItem('token');
        };

        // set the token or clear the token
        //if token passed, setter
        //else, clear it from local storage
        authTokenFactory.setToken = function(token) {
          //if passed
          if (token) {
            $window.localStorage.setItem('token', token);
          }
          //clear it
          else {
            $window.localStorage.removeItem('token');
          }

        };


        return authTokenFactory;
    })


    // ===================================================
    // application configuration to integrate token into requests
    // ===================================================
    .factory('AuthInterceptor', function($q, AuthToken) {
        var interceptorFactory = {};

        // attach the token to every request
        // this will happen on all HTTP requests
        interceptorFactory.request = function(config) {

            // grab the token
            var token = AuthToken.getToken();

            // if the token exists, add it to the header as x-access-token
            if (token)
              config.headers['x-access-token'] = token;

            return config;
        };

        // redirect if a token doesn't authenticate
        // happens on response errors
        interceptorFactory.responseError = function(response) {
            // if our server returns a 403 forbidden response
            if (response.status == 403) {
              AuthToken.setToken();
              $location.path('/login');
            }

            return $q.reject(response);
        };


        return interceptorFactory;
    });
