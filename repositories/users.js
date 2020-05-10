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

  async delete(id) {
    const records = await this.getAll()
    const filteredRecords = records.find(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update (id, attrs) {
    // Get records and specific record with the given id
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    // Throw an err if record does not exist
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    // Assign new data to fiund record
    Object.assign(record, attrs);
    await this.writeAll(records);
  }
}


const test = async () => {
  const repo = new UsersRepository("users.json");

  await repo.update("8032af1c",{password: "newpassword"});

  //const users = await repo.getAll();


}

test();

