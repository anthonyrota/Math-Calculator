// taken from http://mathjs.org/examples/browser/angle_configuration.html.html
(function() {
  let replacements = {};

  let config = {
    angles: 'deg'
  };

  ['sin', 'cos', 'tan', 'sec', 'cot', 'csc'].forEach(function(name) {
    const fn = math[name];

    function fnNumber (x) {
      switch (config.angles) {
        case 'deg':
          return Math.round(
            fn(x / 180 * Math.PI) * 10E8) / 10E8;
        default:
          return fn(x);
      }
    }

    replacements[name] = math.typed(name, {
      'number': fnNumber,
      'Array | Matrix': function (x) {
        return math.map(x, fnNumber);
      }
    });
  });

  ['asin', 'acos', 'atan', 'atan2', 'acot', 'acsc', 'asec'].forEach(function(name) {
    const fn = math[name]; // the original function

    function fnNumber (x) {
      var result = fn(x);

      if (typeof result === 'number') {
        switch(config.angles) {
          case 'deg':  return result / 2 / Math.PI * 360;
          default: return result;
        }
      }

      return result;
    }
    
    replacements[name] = math.typed(name, {
      'number': fnNumber,
      'Array | Matrix': function (x) {
        return math.map(x, fnNumber);
      }
    });
  });

  math.import(replacements, { override: true });
  
  $('#key-deg').click(() => config.angles = 'deg');
  $('#key-rad').click(() => config.angles = 'rad');
})();
