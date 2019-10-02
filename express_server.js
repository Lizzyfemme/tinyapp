const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


function generateRandomString() {
  return Math.random().toString(36).replace('0.','').substring(0,6);
}

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
  }
  res.render("urls_new",templateVars,);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  shortURL = generateRandomString() 
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`urls/${shortURL}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
  const shortURL= req.params.shortURL
delete urlDatabase[shortURL];
res.redirect('/urls')
});

app.post(`/urls/:shortURL`, (req, res) => {
  const shortURL= req.params.shortURL
urlDatabase[shortURL]=req.body.longURL
res.redirect('/urls')
});

app.post(`/login`, (req,res) => {
res.cookie("username", req.body.username)
res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = generateRandomString;