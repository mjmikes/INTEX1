const express = require("express");

let app = express();

let path = require("path");

const port = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

let knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "admin1",
        database: "INTEX1",
        port: 5433
    }
});

app.get("/", (req,res) => {
    res.render("index.ejs")
});

app.listen(port, () =>console.log("Server is listening on port 3000"))