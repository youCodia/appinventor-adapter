const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_=';

// long to base64
export const encode64 = (inputNum) => {
  if (typeof inputNum !== 'number') {
    throw new Error(`This is not a number: ${inputNum}`);
  }
  let input = inputNum;
  let output = '';

  while (input >= 64) {
    const remainder = input % 64;
    input = Math.floor(input / 64);
    output = keyStr.charAt(remainder) + output;
  }
  output = keyStr.charAt(input) + output;
  return output;
};

// base64 to long
export const decode64 = (input) => {
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  const base64test = /[^A-Za-z0-9$_=]/g;
  if (base64test.exec(input)) {
    throw new Error('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
  }
  let i = input.length - 1;
  let num = 0;
  do {
    num += keyStr.indexOf(input[i]) * (64 ** (input.length - i - 1));
    i -= 1;
  } while (i >= 0);

  return num;
};
