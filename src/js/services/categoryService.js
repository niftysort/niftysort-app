
app.factory('category', function($http){

  return {

    find: function() {


      return {
        name: 'Headphones',
        suggested: ['lightweight', 'loud', 'durable', 'fashionable']
      }

      //TODO: Set up back end to receive get request

      // $http.get('v1/category/')
      // .success(function(data) {
      //   return data;
      // })
      // .fail(function(err) {
      //   console.log('err');
      // })
    }
  }

})
