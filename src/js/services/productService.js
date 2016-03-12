app.factory('productService', function(){

  return { 

    removeZeroValueProducts: products => {
      return products.filter( val => {
        return (val.xR && val.y);
      });
    },

    getMaxX: products => {
      return products.reduce(function(prev, curr) {
        return (prev.xR >= curr.xR) ? prev : curr;
      });
    },

    getMinX: products => {
      return products.reduce(function(prev, curr) {
        return (prev.xR <= curr.xR) ? prev : curr;
      });
    },

    getMaxY: products => {
      return products.reduce(function(prev, curr) {
        return (prev.y >= curr.y) ? prev : curr;
      });
    }


  };

});