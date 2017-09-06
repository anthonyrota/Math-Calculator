Mathem.calculation = '';
Mathem.prevAnswer = 0;
Mathem.lastCalculation = '';
Mathem.justCalculated = false;

Mathem.mainOutput = $('.outputs .main-output');

Mathem.updateCalculation = function (callback, isOperator) {
  for (let key of Mathem.keys)
    if (key.value && key.operator && isOperator)
      if (Mathem.isLastPartOfCalculation(key.value))
        return false;
  
  if (isOperator && Mathem.justCalculated)
    Mathem.calculation = callback('ANS');
  else
    Mathem.calculation = callback(
      Mathem.justCalculated ? '' : Mathem.calculation
    );
    
  let c = String(Mathem.calculation);
  
  function replaceAll(s, o, n) {
    return s.split(o).join(n);
  }
  
  c = replaceAll(c, '*', '&times;');
  c = replaceAll(c, '/', '&divide;');
  c = replaceAll(c, 'PI', '&pi;');
  c = replaceAll(c, 'sqrt(', '&#8730;');
  
  Mathem.mainOutput.html(c !== '' ? c : '...type input here');
  
  Mathem.justCalculated = false;
};

Mathem.isLastPartOfCalculation = function (val) {
  const { calculation } = Mathem;
  const mlen = Mathem.calculation.length;
  const vlen = val.length;
  const diff = mlen - vlen;
  if (calculation.slice(diff, mlen) === val)
    return true;
  return false;
};

Mathem.deleteIfThere = function (val) {
  const { calculation } = Mathem;
  const mlen = Mathem.calculation.length;
  const vlen = val.length;
  const diff = mlen - vlen;
  if (calculation.slice(diff, mlen) === val) {
    Mathem.updateCalculation(c => c.slice(0, diff));
    return true;
  }
  return false;
};

Mathem.deleteAll = function () {
  Mathem.updateCalculation(() => '');
  Mathem.prevAnswer = 0;
  
  $('.previous-outputs').empty();
};

Mathem.calculate = function () {
  if (Mathem.justCalculated)
    Mathem.calculation = Mathem.lastCalculation;
  
  let c = String(Mathem.calculation);
  Mathem.lastCalculation = c;
  
  let amountOfLeftBrackets = c.split('(').length - 1;
  let amountOfRightBrackets = c.split(')').length - 1;
  if (amountOfLeftBrackets > amountOfRightBrackets)
    Mathem.calculation += ')'.repeat(
      amountOfLeftBrackets - amountOfRightBrackets);
  
  function replaceAll(s, o, n) {
    return s.split(o).join(n);
  }
  
  let s = String(c);
  s = replaceAll(s, 'ANS', Mathem.prevAnswer);
  s = replaceAll(s, '*', '&times;');
  s = replaceAll(s, '/', '&divide;');
  s = replaceAll(s, 'PI', '&pi;');
  s = replaceAll(s, 'sqrt(', '&#8730;');
  
  if (c !== '')
    $(`<span>${s}</span>`)
      .appendTo($('.previous-outputs'));
  
  let scope = {
    ANS: Mathem.prevAnswer
  };
  
  try {
    let node = math.parse(Mathem.calculation, scope);
    let code = node.compile();
    Mathem.calculation = code.eval(scope);
  } catch (e) {
    Mathem.calculation = '';
    
    $('.error-message').addClass('visible');
    setTimeout(function() {
      $('.error-message').removeClass('visible');
    }, 4000);
  }
  
  if (Mathem.calculation === undefined)
    Mathem.calculation = NaN;
  
  Mathem.prevAnswer = Mathem.calculation;
  
  Mathem.updateCalculation(
    () => String(Mathem.calculation));
  
  Mathem.justCalculated = true;
};