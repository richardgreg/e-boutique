const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const productsRouter = require("./routes/admin/products");

const app = express();

// For public files
app.use(express.static("public"))

// Express should automatically use middleware in requests
// This middleware only works with default enctype
app.use(bodyParser.urlencoded({extended: true}));

// For storing user session
app.use(cookieSession({
  keys:["randomStringOfCharacters"]
}));

// Authentications router
app.use(authRouter);

// For admin cruding products
app.use(productsRouter);

app.listen(3000, () => {
  console.log('Listening');
});
