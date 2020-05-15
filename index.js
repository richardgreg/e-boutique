const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const userRepo = require("./repositories/users");

const app = express();

// Express should automatically use middleware in requests
app.use(bodyParser.urlencoded({extended: true}));
// For storing user session
app.use(cookieSession({
  keys:["randomStringOfCharacters"]
}));


app.get('/signup', (req, res) => {
  res.send(`
    <div>
      Your id is ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/signup', async (req, res) => {
  // Get user repository from request body and see if it exists
  const {email, password, passwordConfirmation} = req.body;

  const existingUser = await userRepo.getOneBy({email});
  if (existingUser){
    return res.send("Email already in use!");
  }

  if (password !== passwordConfirmation){
    return res.send("Passwords must match!")
  }

  // Create a user in our repo to represent the person
  const newUser = await userRepo.create({email, password});

  // Store the id of that user inside the users cookie
  // Cookie session object added to req head by cookie-session library
  req.session.userId = newUser.id;

  res.send('Account created!!!');
});

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('Logged out!!');
});

app.get('/signin', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `);
});

app.post('/signin', async (req, res) => {
  const {email, password} = req.body;

  const user = await userRepo.getOneBy({email});

if (!user){
  return res.send('Email not found');
}

if (user.password !== password){
  return res.send("Invalid Password");
}

req.session.userId = user.id;

res.send("You are signed in");
});


app.listen(3000, () => {
  console.log('Listening');
});
