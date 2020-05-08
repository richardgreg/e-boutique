const fs = require("fs"); // For file manipulation
const crypto = require("crypto"); // For generating random ID


class UsersRepository {
  constructor(filename) {
    // Check for filename argument
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    this.filename = filename;

    // check if file exists on drive using fs module
    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  // Reads and gets the file records
  async getAll(){
    // use a promise whenever possible
    // open the file called this.filename, Parse the contents
    // Return the parsed data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8"
      })
    );
  }

  // Create a record of users
  async create(attrs) {
    attrs.id = this.randomId()

    // Load data up for the most recent data available
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
  }

  // Write all users to json file
  async writeAll(records) {
    // Write records to JSON file
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  // generate a random set of Id
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll()
    return records.find(record => record.id === id);
  }

}


const test = async () => {
  const repo = new UsersRepository("users.json");

  // await repo.create({email: "trent@test.com", password: "password"});

  //const users = await repo.getAll();

  const user = await repo.getOne("06e6877c");
  console.log(user);

  // console.log(users);
}

test();

