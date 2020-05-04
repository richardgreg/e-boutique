const fs = require('fs');


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
}


const test = async () => {
  const repo = new UsersRepository("users.json");

  const users = await repo.getAll();

  console.log(users)
}

test();

