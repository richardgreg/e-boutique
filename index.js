const express = require("express");

const app = express();

// Express should automatically use middleware in requests
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hi there!");
});

app.listen(3000, () => {
  console.log("Listening");
})