const express = require("express");
const bodyParser = require("body-parser");
const userRepo = require("./repositories/users");

const app = express();

// Express should automatically use middleware in requests
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/', async (req, res) => {
  // Get user repository from request body and see if it exists
  const {email, password, passwordConfirmation} = req.body;

  const existingUser = await userRepo.getOneBy({email});
  if (existingUser){
    return res.send("Email already in use!");
  }

  if (password !== passwordConfirmation){
    return res.send("Passwords must match!")
  }
  res.send('Account created!!!');
});

app.listen(3000, () => {
  console.log('Listening');
});
