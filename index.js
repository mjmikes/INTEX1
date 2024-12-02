const express = require("express");
const { default: test } = require("node:test");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

let knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.RDS_USERNAME || "postgres",
        password: process.env.RDS_PASSWORD || "admin1",
        database: process.env.RDS_DB_NAME || "INTEX1",
        port: process.env.RDS_PORT || 5433,
        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    },
    pool: {
        min: 2,
        max: 15 // Increased max pool size to handle more connections
    }
});

app.get("/", (req,res) => {
    res.render("index.ejs")
});

// Serve static files from the "public" directory
app.use(express.static('public'));

app.listen(port, () =>console.log(`Server is listening on port ${port}`))