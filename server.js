const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const GitHubStrategy = require("passport-github");
const proxy = require("express-http-proxy");

let app = express();

if (process.env.NODE_ENV !== "production") {
  require("now-env");
}

const PORT = process.env.PORT || 1234;

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(str, done) {
  done(null, JSON.parse(str));
});

const strategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/github/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, { profile, accessToken });
  }
);

passport.use(strategy);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/github", (req, res, next) => {
  strategy._callbackURL = `${
    req.hostname === "localhost" ? "http" : "https"
  }://${req.hostname}${
    req.hostname === "localhost" ? `:${PORT}` : ""
  }/auth/github/callback`;
  return passport.authenticate("github", { scope: req.query.scope })(
    req,
    res,
    next
  );
});

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

app.use(
  "/github",
  proxy("api.github.com", {
    https: true,
    filter: (req, res) => req.user,
    proxyReqPathResolver() {
      return "/graphql";
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      proxyReqOpts.headers["Authorization"] = `bearer ${
        srcReq.user.accessToken
      }`;
      return proxyReqOpts;
    }
  })
);

if (process.env.NODE_ENV !== "production") {
  const Bundler = require("parcel-bundler");
  const bundler = new Bundler("index.html");
  app.use(bundler.middleware());
} else {
  app.use(express.static("dist"));
}

app.listen(PORT);
console.log(`Listening on ${PORT}`);
