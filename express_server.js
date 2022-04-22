// DEPENDENCIES //
const express = require("express");
const bodyParser = require("body-parser"); // Helps make data readable
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');
const { generateRandomString, getUserByEmail, urlsForUser, } = require("./helpers");
const app = express();
const PORT = 8080; // default port 8080

// MIDDLEWARE //
app.set("view engine", "ejs"); // Tells Express app to use EJS as a templating engine 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: "userID",
  keys: ['key1', 'key2'],
}));

// VARIABLES //
const urlDatabase = {
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

// GET REQUESTS //
// Redirects to url or login page
app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

// Prints out object urlDatabase 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Renders main page 
app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.session.userID],
    urls: urlsForUser(req.session.userID, urlDatabase) };
  res.render("urls_index", templateVars);
});

// Renders the page with the form 
app.get("/urls/new", (req, res) => {
  if (!req.session.userID) {
    res.redirect("/login");
  } else {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.session.userID]
    };
    res.render("urls_new", templateVars);
  }
});

// Directs to modified shortURL page with edit 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL};

  res.render("urls_show", templateVars);
});

// Redirects any shortURL to it's longURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.send("Page does not exist");
    return res.status(400);
  }
});

// Renders login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.userID]
  };
  res.render("login", templateVars);
});

// Renders sign-up page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  res.render("register", templateVars);
});

// POST REQUESTS //

// Adds new url to database and redirects to short url page //
app.post("/urls", (req, res) => {
  if (req.session.userID) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.userID
    };
    res.redirect(`/urls/${shortURL}`);
  }
});

// Delete existing URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// Edits existing URL
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

// Login route
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = getUserByEmail(email, users)
  if (!email || !password) {
    const templateVars = {
      user: users[req.session.userID],
      error: "Status 400: You have left a field empty",
    };
    return res.status(400).render("errors", templateVars);
  }
  if (!userID) {
    const templateVars = {
      user: users[req.session.userID],
      error: "An account does not exist!",
    };
    return res.status(403).render("errors", templateVars);
  }
  if (!bcrypt.compareSync(password, users[userID].password)) {
    const templateVars = {
      user: users[req.session.userID],
      error: "You have entered the wrong password.",
    };
    return res.status(403).render("errors", templateVars);
  }
  req.session.userID = userID;
  return res.redirect("/urls");
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("userID", req.body);
  res.redirect("/urls");
});

// Sign up for new account while checking for existing accounts
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Email and Password required");
  }
  for (let id in users) {
    if (email === users[id].email) {
      return res.status(400).send("Email already registered");
    }
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = { id, email, password: hashedPassword,};
  users[id] = user;
  res.cookie("userID", id);
  res.redirect("/urls");
});

// LISTENS TO PORT //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
