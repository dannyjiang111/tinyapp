// DEPENDENCIES //
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// VARIABLES //
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// GET REQUESTS //
// Prints out Hello when accessing the root path / //
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Prints out object urlDatabase //
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// POST REQUESTS //


// LISTENS TO PORT //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
