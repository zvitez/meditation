let Utils = {
  randomBetween: function(min, max) {
    return Math.random() * (max - min) + min;
  },

  isNumber: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  map: function(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  }
}

export default Utils;