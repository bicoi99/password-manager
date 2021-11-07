const generatePassword = (length = 20) => {
  const pattern = new RegExp("^[a-zA-Z0-9_.-]*$");
  let char;
  let arr = new Uint8Array(1);

  return Array.apply(null, { length: length })
    .map(() => {
      while (true) {
        char = String.fromCharCode(window.crypto.getRandomValues(arr)[0]);
        if (pattern.test(char)) return char;
      }
    })
    .join("");
};

export default generatePassword;
