const fs = require("fs"); // For file manipulation
const crypto = require("crypto"); // For generating random ID


module.exports = class Repository {
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

  // generic async fxn for creating items
  async create(attrs) {
    attrs.id = this.randomId()

    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);

    return attrs;
  }

  // Reads and gets the file records
  async getAll() {
    // use a promise whenever possible
    // open the file called this.filename, Parse the contents
    // Return the parsed data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
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
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.find((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    // Get records and specific record with the given id
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    // Throw an err if record does not exist
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    // Assign new data to fiund record
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  // Finds one user with the given filters
  async getOneBy(filters) {
    const records = await this.getAll();

    // Iterate through all the key value pairs of filter and
    // if it matches a record, return the record
    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
};