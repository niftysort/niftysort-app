app.factory('productService', function(){

  return { 

    // TODO: convert to es6 object function notation
    removeZeroValueProducts: products => {
      return products.filter( val => {
        return (val.xR && val.y);
      });
    }


  };

});