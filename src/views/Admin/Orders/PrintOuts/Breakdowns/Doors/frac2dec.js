function frac2dec(fraction) {
  /* assumes fraction is in the form  1-1/2 or 1 1/2 */
  /* doesn't work on negative numbers */
  var fractionParts = fraction.split('-');
  if (fractionParts.length === 1) {
    /* try space as divider */
    fractionParts = fraction.split(' ');
  }
<<<<<<< HEAD

  let decimalParts;
  let decimal;
=======
>>>>>>> staging

  if (fractionParts.length > 1 && fraction.indexOf('/') !== -1) {
    var integer = parseInt(fractionParts[0]);
    decimalParts = fractionParts[1].split('/');
    decimal = parseInt(decimalParts[0]) / parseInt(decimalParts[1]);
    
    return integer + decimal;
  }
  else if (fraction.indexOf('/') !== -1) {
<<<<<<< HEAD
    decimalParts = fraction.split('/');
    decimal = parseInt(decimalParts[0]) / parseInt(decimalParts[1]);
=======
    var decimalParts = fraction.split('/');
    var decimal = parseInt(decimalParts[0]) / parseInt(decimalParts[1]);
>>>>>>> staging
    return decimal;
  }
  else {
    return parseInt(fraction);
  }
}

export default frac2dec;