const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const stringLength = 6;
  for (let i = 0; i < stringLength; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

// DEPENDENCIES //
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// MIDDLEWARE //
app.set("view engine", "ejs"); // Tells Express app to use EJS as a templating engine 
const bodyParser = require("body-parser"); // Helps make data readable
app.use(bodyParser.urlencoded({extended: true}));

// VARIABLES //
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// GET REQUESTS //
// Prints out Hello when accessing the root path / 
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Prints out object urlDatabase 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Prints out Hello World 
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Renders main page 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Renders the page with the form 
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Directs to modified shortURL page with edit 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

// Redirects any shortURL to it's longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// POST REQUESTS //

// Adds new url to database and redirects to short url page //
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL
  res.redirect("/urls");
});

//
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// LISTENS TO PORT //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
