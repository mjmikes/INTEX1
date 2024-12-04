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
        host : process.env.RDS_HOSTNAME || "awseb-e-3dmmzs5fan-stack-awsebrdsdatabase-rm7jlczpxzug.cr82swsq26ts.us-east-1.rds.amazonaws.com",
        user : process.env.RDS_USERNAME || "ebroot",
        password : process.env.RDS_PASSWORD || "admin123",
        database : process.env.RDS_DB_NAME || "intex1",
        port : process.env.RDS_PORT || 5433,
        ssl : process.env.DB_SSL ? { rejectUnauthorized: false } : false
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

// Home page
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Contact Us page
app.get("/contact_us", (req, res) => {
    res.render("contact_us.ejs");
});

// FAQs page
app.get("/faqs", (req, res) => {
    res.render("faqs.ejs");
});

// Our Tech page
app.get("/our_tech", (req, res) => {
    res.render("our_tech.ejs");
});

// Sponsor Us page
app.get("/sponsor_us", (req, res) => {
    res.render("sponsor_us.ejs");
});

// Upcoming Events page
app.get("/upcoming_events", (req, res) => {
    res.render("upcoming_events.ejs");
});

// Requested Events page 
app.get("/requested_events", (req, res) => {
    res.render("requested_events.ejs");
});

// Completed Events page (protected by authentication)
app.get("/completed_events", (req, res) => {
    res.render("completed_events.ejs");
});

// Volunteers page (protected by authentication)
app.get("/volunteers", (req, res) => {
    res.render("volunteers.ejs");
});

// Event Dashboard page (protected by authentication)
app.get("/event_dashboard", (req, res) => {
    res.render("event_dashboard.ejs");
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

app.post('/requestEvent', (req, res) => {

    console.log("Request received at /requestEvent");
    console.log("Request body:", req.body);

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
    round_tables,
    rectangle_tables,
    possible_date_1,
    possible_date_2,
  } = req.body;

    console.log("Parsed request data:", {
        event_name,
        first_name,
        last_name,
        phone,
        event_contact_email,
    });

  let contactId;
  let locationId;

  // Insert into event_contact and retrieve its auto-generated ID
  knex('event_contact')
    .insert({
      first_name,
      last_name,
      phone,
      event_contact_email,
    })
    .returning('id') // Retrieve the auto-generated ID (matches your schema)
    .then(([id]) => {
      contactId = id; // Store the generated Event Contact ID
      // Insert into event_location and retrieve its auto-generated ID
      return knex('event_location')
        .insert({
          event_address: event_location_address,
          event_city: event_location_city,
          event_state: event_location_state,
          event_zip: event_location_zip,
        })
        .returning('id');
    })
    .then(([id]) => {
      locationId = id; // Store the generated Event Location ID
      // Insert into event_request with the retrieved foreign keys
      return knex('event_request').insert({
        event_name,
        event_type,
        event_start_time,
        event_duration,
        event_description,
        expected_advanced_sewers,
        sewing_machines_available,
        expected_participants,
        children_under_10,
        jen_story,
        event_space_description,
        round_tables,
        rectangle_tables,
        possible_date_1,
        possible_date_2,
        event_contact_id: contactId, // Use the generated Event Contact ID
        event_location_id: locationId, // Use the generated Event Location ID
      });
    })
    .then(() => {
      res.redirect('/'); // Redirect after all inserts are complete
    })
    .catch((error) => {
      console.error('Error adding event request:', error.message);
      res.status(500).send('Internal Server Error');
    });
});


app.listen(port, () =>console.log(`Server is listening on port ${port}!`))