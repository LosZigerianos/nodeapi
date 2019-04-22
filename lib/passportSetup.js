const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../model/User');
const localConfig = require('../localConfig');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: localConfig.googleAuth.clientID,
    clientSecret: localConfig.googleAuth.clientSecret,
    callbackURL: localConfig.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("Dentro de funcion")
    console.log("profile: ", profile);
       User.findOne({ googleId: profile.id }, function (err, user) {

        console.log("Dentro de User.findOrCreate")

        if (err) {
          console.log("Error en auth google")
          next(err);
          return;
        }

        if (user) {
          console.log("Exito en auth google")
          console.log("user: ", user)
          return done(null, user);
        } else {
          console.log("user: ", user)
          console.log('Guardar usuario en la base de datos');
          return;

          /*
          // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
          */
        }

        
       });
  }
));

module.exports = passport;
