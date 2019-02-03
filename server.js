const express = require("express");
const cookieParser = require("cookie-parser");
const { Strategy: JwtStrategy } = require("passport-jwt");
const generateJwt = require("./generate-token");
const bodyParser = require("body-parser");
const passport = require("passport");
const GitHubStrategy = require("passport-github");
const proxy = require("express-http-proxy");

let app = express();

if (process.env.NODE_ENV !== "production") {
  require("now-env");
}

const PORT = process.env.PORT || 1234;


function cookieExtractory (req) {
  return (req && req.cookies)
    ? req.cookies["geojsonnet-jwt"]
    : null
}
const jwtStrategy = new JwtStrategy({
  jwtFromRequest: cookieExtractory,
  secretOrKey: process.env.SESSION_SECRET,
  issuer: "geojsonnet",
  audience: "geojsonnet"
}, (jwt, next) => {
  next(null, jwt)
});

passport.use("jwt", jwtStrategy);

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

passport.use("github", strategy, {session: false});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

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
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  function(req, res) {
    const token = generateJwt(req.user);

    res.cookie("geojsonnet-jwt", token);
    res.redirect("/");
  }
);

app.get(
  "/auth/github/logout",
  function(req, res) {
    res.cookie("geojsonnet-jwt", "", {
      maxAge: "-9"
    });
    res.redirect("/");;
  }
);

app.use(
  "/github/",
  passport.authenticate(["jwt"], { session: false }),
  proxy("api.github.com", {
    https: true,
    proxyReqPathResolver() {
      return "/graphql";
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      proxyReqOpts.headers["Cookie"] = "";
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
