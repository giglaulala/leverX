const bcrypt = require("bcrypt");

async function hashedPassword() {
  const plainPassword = "ilovepenelopacruz";
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Plain:", plainPassword);
  console.log("Hash: ", hash);
}

hashedPassword();
