const crypto = require("crypto");

const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALG, Buffer.from(process.env.ENCRYPTION_KEY), iv);

  const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()]).toString("hex");

  return { iv: iv.toString("hex"), encryptedPassword };
};

const decrypt = (iv, encryptedPassword) => {
  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPTION_ALG,
    Buffer.from(process.env.ENCRYPTION_KEY),
    Buffer.from(iv, "hex")
  );

  const password = Buffer.concat([decipher.update(Buffer.from(encryptedPassword, "hex")), decipher.final()]);

  return password.toString();
};

module.exports = { encrypt, decrypt };
