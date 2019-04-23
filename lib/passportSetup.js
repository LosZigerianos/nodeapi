const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../model/User');
const jwt = require('jsonwebtoken');
const localConfig = require('../localConfig');

passport.use(new GoogleStrategy({
    clientID: localConfig.googleAuth.clientID,
    clientSecret: localConfig.googleAuth.clientSecret,
    callbackURL: localConfig.googleAuth.callbackURL//,
    //passReqToCallback : true
  }, async function(accessToken, refreshToken, profile, done) {
    //console.log("profile: ", profile);
    const user = await User.findOne({ googleId: profile.id });

    if (user) {
      return done(null, user);
    } else {

      const newUser = new User();
      if (profile.displayName) { newUser.name = profile.displayName }
      newUser.googleId = profile.id;
      newUser.email = profile.emails[0].value;
      newUser.provider = profile.provider;

      jwt.sign(
        { provider: profile.provider },
        localConfig.jwt.secret,
        { },
        async (err, token) => {
          console.log('token:', token);
  
          if (err) { return done(err); }

          newUser.token = token;

          const userStored = await newUser.save();
          
          if (userStored) {
            done(null, userStored);
            return;
          } else {
            const err = new Error('Invalid credentials');
            err.status = 401;
            done(err);
            return;
          }
      });

    }
  }
));

module.exports = passport;
