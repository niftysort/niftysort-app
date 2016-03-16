app.factory('productService', function(){

  return { 

    removeZeroValueProducts: products => {
      return products.filter( val => {
        return (val.xR && val.y);
      });
    },

    removeHiddenCharacters: topProducts => {
      topProducts.forEach( product => {
        product.info.features = product.info.features.map( feature => {
          var words = feature.replace(/[^\x00-\x7F]/g, "")
            .split(/,?\s+/);
          // Some sentences from amazon features have no spaces between words.
          words = words.map( word => {
            if (word.length > 30) {
              return '';
            } else {
              return word;
            }
          });
          return words.join(' ');
        });
      });

      return topProducts;
    },

    sortCachedData: (products, maxX, maxY) => {
      return products.sort(function(a,b) {
        return ( b.y/maxY.y*5 + (1-(b.xR/maxX.xR))*(5) ) - ( a.y/maxY.y*5 + (1-(a.xR/maxX.xR))*(5) )
      });
    },

    getProductsInRange: (permittedProducts, minPrice, maxPrice) => {
      return permittedProducts.filter(function(val) {
        return (val.xR >= minPrice && val.xR <= maxPrice);
      });
    },

    getTopResults: (sortedProducts, numResults) => {
      return sortedProducts.slice(0, numResults);
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
    },

    resetAll: () => {
      return null;
    },

    resetTop: () => {
      return null;
    }



  };

});