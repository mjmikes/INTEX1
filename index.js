const express = require("express");
const { default: test } = require("node:test");

let app = express();

let path = require("path");

const port = process.env.PORT || 5500;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "awseb-e-3dmmzs5fan-stack-awsebrdsdatabase-rm7jlczpxzug.cr82swsq26ts.us-east-1.rds.amazonaws.com",
        user: process.env.RDS_USERNAME || "ebroot",
        password: process.env.RDS_PASSWORD || "admin123",
        database: process.env.RDS_DB_NAME || "ebdb",
        port : process.env.RDS_PORT || 5433,
        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    },
    pool: {
        min: 2,
        max: 15 // Increased max pool size to handle more connections
    }
});

let app = express();
let path = require("path");
const port = process.env.PORT || 5500;

app.set("view engine", "ejs");

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));

// Setup express session
app.use(session({
    secret: 'yourSecretKey',  // Change this to a more secure secret key
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Setup connect-flash for flash messages (for login errors, etc.)
app.use(flash());

// Define the isAuthenticated middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();  // Proceed to the requested route
    }
    res.redirect('/login');  // Redirect to login if the user is not authenticated
}

// Passport local strategy setup (assuming you have a User model or database)
passport.use(new LocalStrategy(
    function(username, password, done) {
        // Authenticate user here, e.g. check against database
        knex('admins')
            .where({ username: username })
            .first()
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                // Replace this with proper password verification, e.g., bcrypt
                if (user.password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            })
            .catch(err => done(err));
    }
));

// Serialize user into session (store user ID in session)
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize user from session (retrieve user by ID)
passport.deserializeUser(function(id, done) {
    knex('admins')
        .where({ id: id })
        .first()
        .then(user => done(null, user))
        .catch(err => done(err));
});

knex.raw('SELECT 1')
  .then(() => {
    console.log('Connected to the database successfully!');
    process.exit(0); // Exit the script if successful
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit with failure
  });

// GET ROUTES TO ACCESS PAGES
app.get("/", (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    // Flash messages for errors
    const errorMsg = req.flash('error');
    res.render('login', { errorMsg: errorMsg });
});

app.get('/jens_story', (req, res) => {
    res.render('jens_story');
});

app.get('/admin', isAuthenticated, (req, res) => {
    res.render('admin-dashboard');
});

app.get('/request_event', (req, res) => {
    res.render('request_event');
});

app.get('/get_involved', (req, res) => {
    res.render('get_involved');
});

app.get('/donate', (req, res) => {
    res.render('donate');
});

app.use(express.static('public'));


// POST ROUTES TO UPDATE DATA

app.post("/addEventRequest", (req, res) => {
    const {
        event_name, event_contact_first_name, event_contact_last_name,
        event_contact_phone, event_contact_email, event_type, event_location_address,
        event_location_city, event_location_state, event_location_zip, event_start_time,
        event_duration, event_description, expected_advanced_sewers, sewing_machines_available,
        expected_participants, children_under_10, jen_story, event_space_description,
        round_tables, rectangle_tables, possible_date_1, possible_date_2
    } = req.body;

    // Insert into event_contact table
    knex('event_contact')
      .returning('event_contact_id')
      .insert({
        event_contact_first_name: event_contact_first_name,
        event_contact_last_name: event_contact_last_name,
        event_contact_phone: event_contact_phone,
        event_contact_email: event_contact_email
      })
      .then(eventContactIds => {
        const eventContactId = eventContactIds[0];  // Get the ID of the newly inserted event contact

        // Insert into event_location table
        return knex('event_location')
          .returning('event_location_id')
          .insert({
            event_address: event_location_address,
            event_city: event_location_city,
            event_state: event_location_state,
            event_zip: event_location_zip
          }).then(eventLocationIds => {
            const eventLocationId = eventLocationIds[0];  // Get the ID of the newly inserted event location

            // Now insert into event_request table
            return knex('event_request').insert({
                event_name: event_name,
                event_contact_id: eventContactId, // Foreign Key
                event_type: event_type,
                event_location_id: eventLocationId, // Foreign Key
                event_start_time: event_start_time,
                event_duration: event_duration,
                event_description: event_description,
                expected_advanced_sewers: expected_advanced_sewers,
                sewing_machines_available: sewing_machines_available,
                expected_participants: expected_participants,
                children_under_10: children_under_10,
                jen_story: jen_story,
                event_space_description: event_space_description,
                round_tables: round_tables,
                rectangle_tables: rectangle_tables,
                possible_date_1: possible_date_1,
                possible_date_2: possible_date_2
            }).then(() => {
                // After inserting data, send redirect to send a success message
                res.redirect('/event_success_page');  
            }).catch(error => {
                console.error('Error inserting event_request:', error);
                res.status(500).send('Internal Server Error');
            });
        });
      }) // Error message in case it doesnt work
      .catch(error => {
        console.error('Error inserting event_contact or event_location:', error);
        res.status(500).send('Internal Server Error');
      });
});

// POST route for login (Passport authentication)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}));

// Protected routes (only accessible when logged in)
app.get('/requested_events', isAuthenticated, (req, res) => {
    res.render('requested-events');  // Your requested events page
});

app.get('/completed_events', isAuthenticated, (req, res) => {
    res.render('completed-events');  // Your completed events page
});

// Other admin pages protected by isAuthenticated middleware
app.get('/volunteers', isAuthenticated, (req, res) => {
    res.render('volunteers');  // Volunteers page
});

app.get('/event_dashboard', isAuthenticated, (req, res) => {
    res.render('event-dashboard');  // Event dashboard page
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();  // No need for a callback
    res.redirect('/');  // Redirect to home page after logout
});


app.listen(port, () => console.log(`Server is listening on port ${port}!`));
