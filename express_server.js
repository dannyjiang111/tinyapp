// DEPENDENCIES //
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// MIDDLEWARE //
app.set("view engine", "ejs"); // Tells Express app to use EJS as a templating engine 

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

// Prints out Hello World //
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Renders main page //
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Directs to modified shortURL page with edit //
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase};
  res.render("urls_show", templateVars);
});

// POST REQUESTS //


// LISTENS TO PORT //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
