document.addEventListener('DOMContentLoaded', () => {
  const binary = document.getElementById('binary');
  const decimal = document.getElementById('decimal');
  const clear = document.getElementById('clear');

  function preventInvalidKeypress(allowedKeys, e){
    if (allowedKeys.includes(e.key)) {
      return;
    }

    e.preventDefault();
  }

  function convertValues(value, target, convert = (value) => value){
    if (!value) {
      target.value = '';
      return;
    }

    value = convert(value);

    if (isNaN(value)) {
      target.value = 'Invalid number';
      return;
    }

    target.value = value;
  }

  function bin2Dec(binary){
    return parseInt(binary, 2);
  }

  function dec2Bin(decimal){
    return parseInt(decimal, 10).toString(2);
  }

  binary.addEventListener('input', () => binary.style.setProperty('--_otp-digit', binary.selectionStart));
  binary.style.setProperty('--otp-digits', binary.maxLength);

  decimal.addEventListener('input', () => decimal.style.setProperty('--_otp-digit', decimal.selectionStart));
  decimal.style.setProperty('--otp-digits', decimal.maxLength);

  const checkboxes = document.querySelectorAll('.binary-checkboxes input[type="checkbox"]');
  function calcBinaryFromCheckboxes() {
    let binary = '';
    checkboxes.forEach((checkbox) => {
      binary += checkbox.checked ? '1' : '0';
    });

    return binary;
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      binary.value = calcBinaryFromCheckboxes();
      binary.dispatchEvent(new Event('input'));
    });
  });

  clear.addEventListener('click', () => {
    binary.value = '';
    decimal.value = '';
  });

  binary.addEventListener('keypress', (e) => {
    preventInvalidKeypress(['0', '1'], e);
  });

  binary.addEventListener('input', (e) => {
    convertValues(e.target.value, decimal, bin2Dec);
  });

  decimal.addEventListener('keypress', (e) => {
    preventInvalidKeypress(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], e);
  });

  decimal.addEventListener('input', (e) => {
    const maxBinarySize = checkboxes.length;
    const maxDecimalSize = Math.pow(2, maxBinarySize) - 1;
    delete decimal.parentElement.dataset.error;
    if (e.target.value > maxDecimalSize) {
      e.target.value = maxDecimalSize;
      decimal.parentElement.dataset.error = `Max value is ${maxDecimalSize}`;
    }

    convertValues(e.target.value, binary, dec2Bin);
    const b = binary.value.padStart(maxBinarySize, '0');
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = b[index] === '1';
    });
  });
});
