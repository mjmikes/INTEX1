const express = require("express");
const { default: test } = require("node:test");

let app = express();

const session = require('express-session');

let path = require("path");

const port = process.env.PORT || 5500;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: 'your-secret-key',  // Choose a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // set to true if using HTTPS
}));

// Middleware to make `isAdmin` available globally for all routes
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin || false;  // Make isAdmin available in all views
    next();  // Proceed to the next middleware/route handler
});


// Mock admin table for the sake of this example
const adminTable = {
    username: 'admin',
    password: 'admin'
  };

const knex = require("knex")({
    client: "pg",
    connection: {
        host : process.env.RDS_HOSTNAME || "awseb-e-3dmmzs5fan-stack-awsebrdsdatabase-rm7jlczpxzug.cr82swsq26ts.us-east-1.rds.amazonaws.com",
        user : process.env.RDS_USERNAME || "ebroot",
        password : process.env.RDS_PASSWORD || "admin123",
        database : process.env.RDS_DB_NAME || "ebdb",
        port : process.env.RDS_PORT || 5433,
        ssl : process.env.DB_SSL ? { rejectUnauthorized: false } : false
    },
    pool: {
        min: 2,
        max: 15 // Increased max pool size to handle more connections
    }
});

// GET ROUTES TO ACCESS PAGES


// get route for the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// get route for the jen's page
app.get('/jens_story', (req, res) => {
    res.render('jens_story');
});


// get route for the admin page
app.get('/admin', (req, res) => {
    res.render('admin');
});

// get route for the request event page
app.get('/request_event', async (req, res) => {
    res.render('request_event');
});


// get route for the get involved page
app.get('/get_involved', (req, res) => {
    res.render('get_involved');
});

// get route for the donate page
app.get('/donate', (req, res) => {
    res.render('donate');
});

// Contact Us page
app.get("/contact_us", (req, res) => {
    res.render("contact_us");
});

// FAQs page
app.get("/faqs", (req, res) => {
    res.render("faqs");
});

// Our Tech page
app.get("/our_tech", (req, res) => {
    res.render("our_tech");
});

// Sponsor Us page
app.get("/sponsor_us", (req, res) => {
    res.render("sponsor_us");
});

// Upcoming Events page
app.get("/upcoming_events", (req, res) => {
    res.render("upcoming_events");
});

// Requested Events page 
app.get("/requested_events", (req, res) => {
    res.render("requested_events");
});

// Completed Events page (protected by authentication)
app.get("/completed_events", (req, res) => {
    res.render("completed_events");
});

// Volunteers page (protected by authentication)
app.get("/volunteers", (req, res) => {
    res.render("volunteers");
});

// Event Dashboard page (protected by authentication)
app.get("/event_dashboard", (req, res) => {
    res.render("event_dashboard");
});

// Event Success page 
app.get("/event_success_page", (req, res) => {
    res.render("event_success_page");
});


app.post("/RequestEvent", async (req, res) => {
    const {
        event_name,
        first_name,
        last_name,
        phone,
        event_contact_email,
        event_type,
        event_location_address,
        event_location_city,
        event_location_state,
        event_location_zip,
        event_start_time,
        event_duration,
        event_description,
        expected_advanced_sewers,
        sewing_machines_available,
        expected_participants,
        children_under_10,
        jen_story,
        event_space_description,
        round_tables_count,
        rectangle_tables_count,
        possible_date_1,
        possible_date_2
    } = req.body;

    try {
        // Insert into event_contact table
        const [eventContact] = await knex('event_contact')
            .returning('event_contact_id')
            .insert({
                first_name,
                last_name,
                phone,
                event_contact_email
            });

        // Insert into event_location table
        const [eventLocation] = await knex('event_location')
            .returning('event_location_id')
            .insert({
                event_address: event_location_address,
                event_city: event_location_city,
                event_state: event_location_state,
                event_zip: event_location_zip
            });

        // Insert into event_request table
        await knex('event_request').insert({
            event_name,
            event_contact_id: eventContact.event_contact_id, // Extract the actual ID
            event_type,
            event_location_id: eventLocation.event_location_id, // Extract the actual ID
            event_start_time,
            event_duration,
            event_description,
            expected_advanced_sewers,
            sewing_machines_available,
            expected_participants,
            children_under_10,
            jen_story,
            event_space_description,
            round_tables_count,
            rectangle_tables_count,
            possible_date_1,
            possible_date_2
        });

        // Redirect to a success page
        res.redirect('/event_success_page');
    } catch (error) {
        console.error('Error inserting event data:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Admin login form submission route (POST request to authenticate)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminTable.username && password === adminTable.password) {
    req.session.isAdmin = true;  // Store admin login state in session
    res.redirect('/');  // Redirect to home page after successful login
  } else {
    res.redirect('/login');  // Invalid login, stay on login page
  }
});

//Home Page
app.get('/', (req, res) => {
    console.log(req.session);  // Log the entire session object
    res.render('index');
});

app.get('/logout', (req, res) => {
    // Reset isAdmin to false
    req.session.isAdmin = false;
    
    // Destroy the session (this logs the user out completely)
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }

        // Redirect to the homepage (or any other page)
        res.redirect('/');
    });
});



app.listen(port, () =>console.log(`Server is listening on port ${port}!`))