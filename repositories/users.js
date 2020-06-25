const crypto = require("crypto"); // For generating random ID
const util = require("util");
const Repository = require("./repository");

// Use the util module to turn scrypt into an async-await fxn that returns a promise
const scrypt = util.promisify(crypto.scrypt);


class UsersRepository extends Repository {
  // Create a record of users
  async create(attrs) {
    // attrs === {email, password}
    attrs.id = this.randomId();

    // Random salt for appending to password
    const salt = crypto.randomBytes(8).toString("hex");

    // Hash password
    const hashedPassword = await scrypt(attrs.password, salt, 64);

    // Call back method for hasing a password
    // scrypt(attrs.password, salt, 64, (err, derivedKey) => {
    //   const hashed = derivedKey.toString("hex");
    // });

    // Load data up for the most recent data available
    // Prepare the record and push to records
    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${hashedPassword.toString("hex")}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied) {
    // const result = saved.split('.');
    // const hashed = result[0];
    // const salt = result[1];

    const [hashed, salt] = saved.split(".");
    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied.toString("hex");
  }
}

// Export an insdtance of the class
module.exports = new UsersRepository("users.json");
