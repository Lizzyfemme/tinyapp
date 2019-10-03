const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "asd",
    password: "asd"
  }
};

let urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


function checkUserEmail(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
}


function generateRandomString() {
  return Math.random().toString(36).replace('0.', '').substring(0, 6);
}

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"],
  }
  if (req.cookies["user_id"] === undefined) {
    res.render("urls_login", templateVars)
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    urls: urlDatabase
  };
  // for (let shortURL in urlDatabase){
  //  if (templateVars.user_id= urlDatabase[shortURL].userID){
  //    return urlDatabase[shortURL].longURL
  //  }

  // }
  res.render("urls_index", templateVars);

});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/registration", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  }
  res.render("urls_registration", templateVars);
});
app.get("/login", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  }
  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {

  let templateVars = {
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: req.params.longURL
  };
  res.render("urls_show", templateVars);

});

app.post("/urls", (req, res) => {
  shortURL = generateRandomString()
  const createURL = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }
  urlDatabase[shortURL] = createURL;
  console.log(urlDatabase)
  res.redirect(`urls/${shortURL}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
  const shortURL = req.params.shortURL
  for (let code in urlDatabase) {
    if (urlDatabase[code].userID === req.cookies["user_id"]) {
      delete urlDatabase[shortURL];
      res.redirect('/urls')
    }
 
  }
});

app.post(`/registration`, (req, res) => {
  if (req.body.password === "" || req.body.email === "") {
  
    res.status(400);
    res.send("There is no data in the password and/or the email")
  };
  let key = generateRandomString();
  res.cookie("user_id", key)

  const newUser = {
    id: key,
    email: req.body.email,
    password: req.body.password,
  }
  users[key] = newUser

  res.redirect('/urls')
});

app.post(`/urls/:shortURL`, (req, res) => {
  const shortURL = req.params.shortURL
    if (urlDatabase[shortURL].userID == req.cookies["user_id"]) {
      urlDatabase[shortURL] = req.body.longURL
      res.redirect('/urls')
  } else{
    res.status(401)
    res.send("You are not authorized to edit this url.")
  }
});

app.post(`/login`, (req, res) => {
  currentUser = checkUserEmail(req.body.email, users)
  if (!currentUser) {
    res.status(403)
    res.send("This email cannot be found")
  } else {
    if (currentUser.password === req.body.password) {
      res.cookie("user_id", currentUser.id);
      res.redirect('/urls')
    } else {
      res.status(403)
      res.send("This password is incorrect")
    }

  }

});

app.post(`/logout`, (req, res) => {
  res.clearCookie("user_id")
  res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = generateRandomString;