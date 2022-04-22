const getUserByEmail = function(email, users) {
  for (let user in users) {
    if (email === users[user].email) {
      return user;
    }
  }
};

const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const stringLength = 6;
  for (let i = 0; i < stringLength; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

const urlsForUser = function(id, urlDatabase) {
  let myURLs = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      myURLs[key] = urlDatabase[key];
    }
  } return myURLs;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
};