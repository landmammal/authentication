const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

// registration handler
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      db.User.findOne({ where: { email: email } }).then(function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "Email is already in use." });
        }
        db.User.create({
          nickname: req.body.nickname,
          email: email,
          password: password
        }).then(function(dbUser) {
          return done(null, dbUser);
        });
      });
    }
  )
);

// login handler
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      db.User.findOne({ where: { email: email } }).then(function(user) {
        if (!user) {
          return done(null, false, { message: "Email incorrect" });
        }
        if (!user.verifyPassword(password)) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
