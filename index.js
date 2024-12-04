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
        host: "awseb-e-3dmmzs5fan-stack-awsebrdsdatabase-rm7jlczpxzug.cr82swsq26ts.us-east-1.rds.amazonaws.com",
        user: "ebroot",
        password: "admin123",
        database: "ebdb",
        port: 5433,
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 15 // Increased max pool size to handle more connections
    }
});

// GET ROUTES TO ACCESS PAGES

// get route for the landing page (index.ejs1)
app.get("/", (req,res) => {
    res.render("index.ejs")
});

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
app.get('/request_event', (req, res) => {
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

// Serve static files from the "public" directory
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


app.listen(port, () =>console.log(`Server is listening on port ${port}!`))