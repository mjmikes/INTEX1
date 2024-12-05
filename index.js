const express = require("express");
const moment = require('moment-timezone');
const { default: test } = require("node:test");

let app = express();

const session = require('express-session');

let path = require("path");

let security = false;

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

app.use((req, res, next) => {
    res.locals.errorMessage = req.session.errorMessage || false;  // Make isAdmin available in all views
    next();  // Proceed to the next middleware/route handler
});


// Mock admin table for the sake of this example
const adminTable = [
    { username: 'admin', password: 'admin' } // Example credentials
];


const knex = require("knex")({
    client: "pg",
    connection: {
        host : process.env.RDS_HOSTNAME || "localhost",
        user : process.env.RDS_USERNAME || "postgres",
        password : process.env.RDS_PASSWORD || "admin1",
        database : process.env.RDS_DB_NAME || "test",
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

app.get('/help', (req, res) => {
    res.render('help');
});

// get route for the jen's page
app.get('/jens_story', (req, res) => {
    res.render('jens_story');
});

app.get('/user_maintenance', (req, res) => {
    res.render('user_maintenance');
});

// get route to add_admin page
app.get('/add_admin', (req, res) => {
    res.render('add_admin');
});

app.get('/how_to_get_involved', (req, res) => {
    res.render('how_to_get_involved');
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

// Completed Events page (protected by authentication)
app.get("/completed_events", (req, res) => {
    res.render("completed_events");
});

// Event Dashboard page (protected by authentication)
app.get("/event_dashboard", (req, res) => {
    res.render("event_dashboard");
});

// Event Success page 
app.get("/event_success_page", (req, res) => {
    res.render("event_success_page");
});

// Volunteer Success page 
app.get("/volunteer_success_page", (req, res) => {
    res.render("volunteer_success_page");
});

// Sponsor Success page 
app.get("/sponsor_success_page", (req, res) => {
    res.render("sponsor_success_page");
});

// Get route for showing the contact us and sponsor us form submissions
app.get('/messages', async (req, res) => {
    try {
        // Fetch contact_us messages
        const contactMessages = await knex('contact_us')
            .select(
                'contact_us.submission_id',
                'contact_us.first_name',
                'contact_us.last_name',
                'contact_us.phone',
                'contact_us.email',
                'contact_us.city',
                'contact_us.state',
                'contact_us.message',
                'contact_us.created_at'
            )
            .orderBy('contact_us.created_at', 'desc');

        // Format the created_at field for contact_us messages
        contactMessages.forEach(message => {
            console.log('Original created_at (contact_us):', message.created_at);
            message.created_at = moment(message.created_at, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
                .tz('America/Denver')
                .format('YYYY-MM-DD HH:mm');
            console.log('Formatted created_at (contact_us):', message.created_at);
        });

        // Fetch sponsor_us messages
        const sponsorMessages = await knex('sponsor_us')
            .select(
                'sponsor_us.submission_id',
                'sponsor_us.first_name',
                'sponsor_us.last_name',
                'sponsor_us.email',
                'sponsor_us.organization_name',
                'sponsor_us.message',
                'sponsor_us.created_at'
            )
            .orderBy('sponsor_us.created_at', 'desc');

        // Format the created_at field for sponsor_us messages
        sponsorMessages.forEach(sponmessage => {
            console.log('Original created_at (sponsor_us):', sponmessage.created_at);
            sponmessage.created_at = moment(sponmessage.created_at, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
                .tz('America/Denver')
                .format('YYYY-MM-DD HH:mm');
            console.log('Formatted created_at (sponsor_us):', sponmessage.created_at);
        });

        // Render the 'messages' template with both sets of messages
        res.render('messages', { contactMessages, sponsorMessages });

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Server Error');
    }
});


// Post route to send event request form data to database
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

// Get Route to display records from the event_request table to the requested_events.ejs page for the admin
// Assuming you're using Express
app.get('/requested_events', async (req, res) => {
    try {
        // Fetch all event data using Knex or another query builder
        knex('event_request')
            .join('event_contact', 'event_request.event_contact_id', '=', 'event_contact.event_contact_id')
            .join('event_location', 'event_request.event_location_id', '=', 'event_location.event_location_id')
            .select(
                'event_request.event_id',
                'event_request.event_name',
                'event_request.event_type',
                'event_request.event_start_time',
                'event_request.event_duration',
                'event_request.event_description',
                'event_request.expected_advanced_sewers',
                'event_request.sewing_machines_available',
                'event_request.expected_participants',
                'event_request.children_under_10',
                'event_request.jen_story',
                'event_request.event_space_description',
                'event_request.round_tables_count',
                'event_request.rectangle_tables_count',
                'event_request.possible_date_1',
                'event_request.possible_date_2',
                'event_request.actual_date',
                'event_contact.first_name',
                'event_contact.last_name',
                'event_contact.phone',
                'event_contact.event_contact_email',
                'event_location.event_address',
                'event_location.event_city',
                'event_location.event_state',
                'event_location.event_zip'
            )
            .then(event_request => {
                // Render the index.ejs template and pass the data
                // We use res.render to work with ejs files we use res.redirct to work with routes
                res.render('requested_events', { event_request, security });
            })
            .catch(error => {
                console.error('Error querying database:', error);
                res.status(500).send('Internal Server Error');
            });
    } catch (error) {
        console.error('Error fetching event data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user_maintenance_view', async (req, res) => {
    try {
        // Fetch all admin data using Knex
        const admin_records = await knex('admin').select(
            'admin_id',
            'first_name',
            'last_name',
            'phone',
            'email',
            'username',
            'password'
        );

        // Render the user_maintenance_view template with admin_records
        res.render('user_maintenance_view', { admin_records }); // Pass the admin data to the EJS template
    } catch (error) {
        console.error('Error fetching admin data:', error);
        res.status(500).send('An error occurred while fetching user maintenance data.');
    }
});


app.post('/deleteEvent/:id', async (req, res) => {
    const { id } = req.params; // Get the event_id from the URL
    try {
        // Delete the event with the given event_id
        await knex('event_request')
            .where('event_id', id) // Find the record with the given event_id
            .del(); // Delete the record

        // Redirect back to the requested events page after deleting
        res.redirect('/requested_events');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/editEvent/:id', async (req, res) => {
  const { id } = req.params; // Extract the event ID from the route parameter

  try {
    knex('event_request')
      .join('event_contact', 'event_request.event_contact_id', '=', 'event_contact.event_contact_id')
      .join('event_location', 'event_request.event_location_id', '=', 'event_location.event_location_id')
      .select(
        'event_request.event_id',
        'event_request.event_name',
        'event_request.event_type',
        'event_request.event_start_time',
        'event_request.event_duration',
        'event_request.event_description',
        'event_request.expected_advanced_sewers',
        'event_request.sewing_machines_available',
        'event_request.expected_participants',
        'event_request.children_under_10',
        'event_request.jen_story',
        'event_request.event_space_description',
        'event_request.round_tables_count',
        'event_request.rectangle_tables_count',
        'event_request.possible_date_1',
        'event_request.possible_date_2',
        'event_request.actual_date',
        'event_contact.first_name',
        'event_contact.last_name',
        'event_contact.phone',
        'event_contact.event_contact_email',
        'event_location.event_address',
        'event_location.event_city',
        'event_location.event_state',
        'event_location.event_zip'
      )
      .where('event_request.event_id', id) // Filter by the event ID
      .first() // Retrieve only one event
      .then(event_request => {
        if (!event_request) {
          return res.status(404).send('Event not found');
        }

        res.render('edit_event', { event_id: id, event_request }); // Pass event_id and the event data
      })
      .catch(error => {
        console.error('Error querying database:', error);
        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
    console.error('Error fetching event data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/editEvent/:id', (req, res) => {
    const { id } = req.params; // Get the event_id from the URL
    const {
        event_name, first_name, last_name, phone, event_contact_email, event_type, event_location_address,
        event_location_city, event_location_state, event_location_zip, event_start_time, event_duration,
        event_description, expected_advanced_sewers, sewing_machines_available, expected_participants,
        children_under_10, jen_story, event_space_description, round_tables_count, rectangle_tables_count,
        possible_date_1,possible_date_2, actual_date
    } = req.body;
    // Update the Event in the database
    try {
      knex('event_request')
        .join('event_contact', 'event_request.event_contact_id', '=', 'event_contact.event_contact_id')
        .join('event_location', 'event_request.event_location_id', '=', 'event_location.event_location_id')
        .where('event_id', id)
        .update({
          event_name: event_name, first_name: first_name, last_name: last_name, phone: phone,
          event_contact_email: event_contact_email, event_type: event_type,
          event_location_address: event_location_address, event_location_city: event_location_city,
          event_location_state: event_location_state, event_location_zip: event_location_zip,
          event_start_time: event_start_time, event_duration: event_duration,
          event_description: event_description, expected_advanced_sewers: expected_advanced_sewers,
          sewing_machines_available: sewing_machines_available, expected_participants: expected_participants,
          children_under_10: children_under_10, jen_story: jen_story,
          event_space_description: event_space_description, round_tables_count: round_tables_count,
          rectangle_tables_count: rectangle_tables_count, possible_date_1: possible_date_1,
          possible_date_2: possible_date_2, actual_date: actual_date
        })
      .then(() => {
        res.redirect('/requested_events'); // Redirect to the list of Pokémon after saving
      })
      .catch(error => {
        console.error('Error updating Events:', error);
        res.status(500).send('Internal Server Error');
      });
    } catch (error) {
      console.error('Error editing event:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Post route to send volunteer form data to database
app.post("/submit-volunteer", async (req, res) => {
    const {
        first_name,
        last_name,
        phone,
        email,
        address,
        city,
        state,
        zip,
        sewing_level,
        monthly_hour_availability,
        willing_to_travel_county,
        willing_to_travel_state,
        willing_to_teach,
        willing_to_lead,
        source,
        details
    } = req.body;
    try {
        // Insert into volunteer_info table
        await knex('volunteer_info').insert({
            first_name,
            last_name,
            phone,
            email,
            address,
            city,
            state,
            zip,
            sewing_level,
            monthly_hour_availability,
            willing_to_travel_county,
            willing_to_travel_state,
            willing_to_teach,
            willing_to_lead,
            source,
            details
        });
        // Redirect to a success page
        res.redirect('/volunteer_success_page');
    } catch (error) {
        console.error('Error inserting volunteer data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Post route to send sponsor form data to database
app.post("/submit-sponsor", async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        organization_name,
        message
    } = req.body;
    try {
        // Insert into volunteer_info table
        await knex('sponsor_us').insert({
            first_name,
            last_name,
            email,
            organization_name,
            message
        });
        // Redirect to a success page
        res.redirect('/sponsor_success_page');
    } catch (error) {
        console.error('Error inserting sponsor data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Post route to send admin form data to database
app.post("/add-admin", async (req, res) => {
    const {
        first_name,
        last_name,
        phone,
        email,
        username,
        password
    } = req.body;
    try {
        // Insert into admin table
        await knex('admin').insert({
            first_name,
            last_name,
            phone,
            email,
            username,
            password
        });
        // Redirect to a success page
        res.redirect('/volunteers');
    } catch (error) {
        console.error('Error inserting volunteer data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Post route to send admin form data to database
app.post("/contact_us", async (req, res) => {
    const {
        first_name,
        last_name,
        phone,
        email,
        username,
        password
    } = req.body;
    try {
        // Insert into admin table
        await knex('admin').insert({
            first_name,
            last_name,
            phone,
            email,
            username,
            password
        });
        // Redirect to a success page
        res.redirect('/volunteers');
    } catch (error) {
        console.error('Error inserting volunteer data:', error);
        res.status(500).send('Internal Server Error');
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

// POST route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if both fields are filled out
    if (!username || !password) {
        return res.render('login', { errorMessage: 'Username and password are required.' });
    }

    // Find the user in the adminTable array
    const user = adminTable.find(user => user.username === username && user.password === password);

    // If no matching user or incorrect credentials
    if (!user) {
        return res.render('login', { errorMessage: 'Invalid username or password.' });
    }

    // Successful login, store admin session and redirect
    req.session.isAdmin = true;
    res.redirect('/');
});

// volunteer section
app.get('/volunteers', async (req, res) => {
    try {
        const volunteer_info = await knex('volunteer_info')
            .select(
                'volunteer_id',
                'first_name',
                'last_name',
                'address',
                'city',
                'state',
                'zip',
                'phone',
                'email',
                'source',
                'sewing_level',
                'monthly_hour_availability',
                'willing_to_teach',
                'willing_to_lead',
                'willing_to_travel_county',
                'willing_to_travel_state',
                'details'
            );

        // Render the 'volunteers' view and pass the data
        res.render('volunteers', { volunteer_info });
    } catch (error) {
        console.error('Error querying database for volunteers:', error);
        res.status(500).send('Internal Server Error');
    }
});


  // Post route to send admin form data to database
app.post("/submit-contact", async (req, res) => {
    const {
        first_name,
        last_name,
        phone,
        email,
        city,
        state,
        message,
    } = req.body;

    try {
        // Insert into admin table
        await knex('contact_us').insert({
            first_name,
            last_name,
            phone,
            email,
            city,
            state,
            message,
        });

        // Render the index page with a success message
        res.render("index", {
            successMessage: "Thank you for reaching out! We will get back to you shortly.",
        });
    } catch (error) {
        console.error("Error inserting volunteer data:", error);
        res.status(500).render("index", {
            errorMessage: "Something went wrong. Please try again later.",
        });
    }
});

app.post('/deleteMessage/:submission_id', async (req, res) => {
    const { submission_id } = req.params; // Get the submission_id from the URL

    try {
        // Delete the message with the given submission_id
        await knex('contact_us')
            .where('submission_id', submission_id) // Find the record with the given ID
            .del(); // Delete the record

        // Redirect back to the messages page after deleting
        res.redirect('/messages');
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/deleteAdmin/:id', async (req, res) => {
    const adminId = req.params.id; // Extract the admin_id from the URL

    try {
        // Use Knex to delete the admin record by admin_id
        await knex('admin')
            .where('admin_id', adminId) // Match on the correct column name
            .del();

        console.log(`Admin with ID ${adminId} successfully deleted.`);
        // Redirect to the user maintenance page after deletion
        res.redirect('/user_maintenance');
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).send('Error deleting admin record.');
    }
});





app.listen(port, () =>console.log(`Server is listening on port ${port}!`))