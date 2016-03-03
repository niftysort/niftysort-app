
app.factory('category', function($http){

  return {

    find: function(userQuery) {



      if(userQuery === "headphones") {
        return {
          data: {
            name: 'Headphones',
            suggested: ['lightweight', 'loud', 'durable', 'fashionable']
          }
        }
      } else {
        return {
          err: 'Error!'
        }
      }

      //TODO: Set up back end to receive get request


      // $http.get('v1/category/'+ userQuery )
      // .success(function(data) {
      //   return data;
      // })
      // .fail(function(err) {
      //   console.log('err');
      // })
    }
  }

})
