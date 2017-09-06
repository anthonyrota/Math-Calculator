Mathem.keys = [];
Mathem.constants = [];
Mathem.shifting = false;

Mathem.bindConstant = function (keycodes, id, value, shiftRequired, isOperator) {
  const func = c => {
    if (c === '0')
      return value;
    return c + value;
  };
  
  $('#key-' + id).click(
    () => Mathem.updateCalculation(func, isOperator));
  
  Mathem.constants.push(value);
  Mathem.keys.push({
    codes: typeof keycodes === Object ? keycodes : [keycodes],
    cb: func,
    shift: shiftRequired,
    value: value,
    operator: isOperator
  });
};

Mathem.bindFunction = function (keycodes, id, func, shiftRequired) {
  $('#key-' + id).click(
    () => Mathem.updateCalculation(func));
  
  Mathem.keys.push({
    codes: typeof keycodes === Object ? keycodes : [keycodes],
    cb: func,
    shift: shiftRequired,
  });
};

Mathem.bindUnrepeatableConstant = function (keycodes, id, value, norepeat, shiftRequired) {
  const nlen = norepeat.length;
  const func = c => {
    const clen = c.length;
    if (c.slice(clen - nlen, clen) === norepeat)
      return c;
    return c + value;
  };
  
  $('#key-' + id).click(
    () => Mathem.updateCalculation(func));
  
  Mathem.constants.push(value);
  Mathem.keys.push({
    codes: typeof keycodes === Object ? keycodes : [keycodes],
    cb: func,
    value: value,
    shift: shiftRequired
  });
};

Mathem.keyUp = function (e) {
  if (e.which === 16)
    Mathem.shifting = false;
};

Mathem.delete = function () {
  for (let constant of Mathem.constants)
    if (Mathem.deleteIfThere(constant))
      return;
};

Mathem.keyDown = function (e) {
  const { keysDown, keys, updateCalculation } = Mathem;
  
  if (e.ctrlKey)
    return;
  
  if (e.which === 16) {
    Mathem.shifting = true;
    return;
  }
  
  if (e.which === 8 && Mathem.shifting)
    Mathem.deleteAll();
  
  if (e.which === 8) {
    Mathem.delete();
    return;
  }
  
  if (e.which === 13 || (e.which === 187 && !Mathem.shifting)) {
    Mathem.calculate();
    return;
  }
  
  Mathem.keys.forEach(key => {
    const { codes, cb, shift, operator } = key;
    if (shift ? !Mathem.shifting : Mathem.shifting)
      return;
    for (let code of codes)
      if (e.which === code)
        Mathem.updateCalculation(cb, operator);
  });
};
