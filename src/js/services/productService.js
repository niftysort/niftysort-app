app.factory('productService', function(){

  return { 

    removeZeroValueProducts: products => {
      return products.filter( val => {
        return (val.xR && val.y);
      });
    },

    getProductsInRange: (permittedProducts, minPrice, maxPrice) => {
      return permittedProducts.filter(function(val) {
        return (val.xR >= minPrice && val.xR <= maxPrice);
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