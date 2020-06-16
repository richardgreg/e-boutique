const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");

const app = express();
// Express should automatically use middleware in requests
app.use(bodyParser.urlencoded({extended: true}));
// For storing user session
app.use(cookieSession({
  keys:["randomStringOfCharacters"]
}));

app.use(authRouter);

app.listen(3000, () => {
  console.log('Listening');
});
