const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const checkUserEmail = require("./helpers.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set("view engine", "ejs");

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "jkl@gmail.com",
    password: bcrypt.hashSync("jkl", 10)
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "asd@gmail.com",
    password: bcrypt.hashSync("asd",10),
  }
};

let urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

let generateRandomString = function() {
  return Math.random().toString(36).replace('0.', '').substring(0, 6);
};

//-----GETS---------------
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id,
  };
  if (req.session.user_id === undefined) {
    res.render("urls_login", templateVars);
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id,
    shortURL: req.params.shortURL,
    urls: urlDatabase
  };
  if (req.session.user_id === undefined) {
   
    res.render("urls_login",templateVars);
  } else {
    res.render("urls_index",templateVars);
  }
});
app.get("/urls", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id,
    shortURL: req.params.shortURL,
    urls: urlDatabase
  };
  
  if (req.session.user_id !== undefined) {
    res.render("urls_index",templateVars);
  } else {
    res.status(401);
    res.send("Please login or register");
  }
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/registration", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id
  };
  
  res.render("urls_registration", templateVars);
});
app.get("/login", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  
  let templateVars = {
    user_id: req.session.user_id,
    shortURL: shortURL,
    longURL: urlDatabase[shortURL]["longURL"]
  };
  res.render("urls_show", templateVars);


});
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]["longURL"];
  res.redirect(longURL);
});
//---------POST-------------------
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  const createURL = {
    longURL: req.body.longURL,
    userID: req.session.user_id.id
  };
  urlDatabase[shortURL] = createURL;
  console.log(urlDatabase);
  res.redirect(`urls/${shortURL}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
  const shortURL = req.params.shortURL;
  for (let code in urlDatabase) {
    if (urlDatabase[code].userID === req.session.user_id.id) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    }
  }
});

app.post(`/registration`, (req, res) => {
  if (req.body.password === "" || req.body.email === "") {
  
    res.status(400);
    res.send("There is no data in the password and/or the email");
  }
 
  let key = generateRandomString();
  
  const newUser = {
    id: key,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  users[key] = newUser;
  req.session.user_id = users[key];
  res.redirect('/urls');
});

app.post(`/urls_show`, (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === req.session.user_id.id) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.status(401);
    res.send("You are not authorized to edit this url.");
  }
});

app.post(`/login`, (req, res) => {
  let currentUser = checkUserEmail(req.body.email, users);
  if (!currentUser) {
    res.status(403);
    res.send("This email cannot be found");
  } else {
    if (bcrypt.compareSync(req.body.password, currentUser.password)) {
      req.session.user_id = currentUser;
      res.redirect('/urls');
    }
  }
});

app.post(`/logout`, (req, res) => {
  req.session.user_id = undefined;
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = generateRandomString;


