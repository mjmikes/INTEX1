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
        password: "your_password",
        database: "ebdb",
        port: 5433,
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 15 // Increased max pool size to handle more connections
    }
});


// get route for the landing page (index.ejs1)
app.get("/", (req,res) => {
    res.render("index.ejs")
});

// get route for the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// get route for the admin page
app.get('/admin', (req, res) => {
    res.render('admin');
});

// get route for the request event page
app.get('/request_event', (req, res) => {
    res.render('request_event');
});

// get route for the volunteer page
app.get('/volunteer', (req, res) => {
    res.render('volunteer');
});

// get route for the donate page
app.get('/donate', (req, res) => {
    res.render('donate');
});

// Serve static files from the "public" directory
app.use(express.static('public'));

app.listen(port, () =>console.log(`Server is listening on port ${port}!`))