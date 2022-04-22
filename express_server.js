const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const stringLength = 6;
  for (let i = 0; i < stringLength; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

const findEmail = function(email) {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
};

const urlsForUser = function(id) {
  let myURLs = {};
  for (let key in urlDatabase) {
    let userID = urlDatabase[key].userID
      if (id === userID) {
        myURLs[key] = urlDatabase[key].longURL;
        return myURLs;
    }
  }
};

// DEPENDENCIES //
const express = require("express");
const bodyParser = require("body-parser"); // Helps make data readable
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port 8080

// MIDDLEWARE //
app.set("view engine", "ejs"); // Tells Express app to use EJS as a templating engine 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// VARIABLES //
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
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
  const data = req.cookies["user"];
  const user = users[data];
  let myURLs = {};

  for (let key in urlDatabase) {
    let userID = urlDatabase[key].userID
    if (req.cookies["user"] === userID) {
      myURLs[key] = urlDatabase[key].longURL;
    }
  }
   const templateVars = { 
    user: user,
    urls: myURLs };
    res.render("urls_index", templateVars);
});

// Renders the page with the form 
app.get("/urls/new", (req, res) => {
  const data = req.cookies["user"];
  const user = users[data];
  const userID = req.cookies["user"];
  const templateVars = {
    user: user,
  }
  if (!userID) {
    res.redirect("/login?")
  } else {
    res.render("urls_new", templateVars);
  }
});

// Directs to modified shortURL page with edit 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    user: req.cookies["user"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

// Redirects any shortURL to it's longURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase.hasOwnProperty(req.params.shortURL)){
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
    } else {
      res.send("Page does not exist");
      return res.status(400);
  }
});

// Renders sign-up page
app.get("/register", (req, res) => {
  const data = req.cookies["user"];
  const user = users[data];
  const templateVars = {
    user: user,
  };
  res.render("register", templateVars)
});

// Renders login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user"]],
  }
  res.render("login", templateVars);
});

// POST REQUESTS //

// Adds new url to database and redirects to short url page //
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL
  res.redirect("/urls");
});

// Delete existing URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
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
  const user = findEmail(req.body.email)

  if (!email || !password) {
    return res.status(400).send("Email and Password required");
  };

  if (!user || bcrypt.compareSync(password, user.password)) {
    return res.status(400).send("Email or Password incorrect");
  }

    res.cookie("user", user.id);
    res.redirect("urls");
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("user", req.body)
  res.redirect("/urls");
});

// Sign up for new account while checking for existing accounts
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Email and Password required");
  };
  for (let id in users) {
    if (email === users[id].email) {
      return res.status(400).send("Email already registered");
    };
  };
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = { id, email, password: hashedPassword,};
  users[id] = user
  res.cookie("user", id);
  res.redirect("/urls");
});

// LISTENS TO PORT //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
