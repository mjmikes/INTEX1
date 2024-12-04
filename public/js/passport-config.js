const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db');  // Your database connection

// Passport configuration for local strategy (admin login)
module.exports = function (passport) {
    passport.use(new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' },
        function (username, password, done) {
            db.query('SELECT * FROM admin WHERE username = $1', [username], (err, result) => {
                if (err) {
                    return done(err);
                }
                if (!result.rows.length) {
                    return done(null, false, { message: 'No user found with that username' });
                }

                const user = result.rows[0];
                
                // Compare passwords
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                });
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);  // Store user ID in session
    });

    passport.deserializeUser(function (id, done) {
        db.query('SELECT * FROM admin WHERE id = $1', [id], (err, result) => {
            done(err, result.rows[0]);  // Fetch user from DB
        });
    });
};
