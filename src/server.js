// MEDVETET SÅRBAR app för SAST-övningen. Kör den aldrig i produktion.
const express = require("express");
const sqlite3 = require("sqlite3");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT)");
  db.run("INSERT INTO products (name) VALUES ('Penna'), ('Block'), ('Sudd')");
});

// Hårdkodade uppgifter
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "hemligt123";

// Sök produkter
app.get("/search", (req, res) => {
  const q = req.query.q;
  const sql = "SELECT * FROM products WHERE name LIKE '%" + q + "%'";
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).send("Fel");
    // Visar sökordet direkt på sidan
    res.send("<h1>Resultat för " + q + "</h1>" + JSON.stringify(rows));
  });
});

// Pinga en server
app.get("/ping", (req, res) => {
  exec("ping -c 1 " + req.query.host, (err, stdout) => {
    res.send("<pre>" + (stdout || "ingen respons") + "</pre>");
  });
});

// Visa en fil
app.get("/file", (req, res) => {
  const filePath = path.join(__dirname, "files", req.query.name);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).send("Hittades inte");
    res.type("text/plain").send(data);
  });
});

// Enkel inloggning
app.get("/login", (req, res) => {
  if (req.query.user === ADMIN_USER && req.query.pass === ADMIN_PASSWORD) {
    res.send("Välkommen admin");
  } else {
    res.status(401).send("Fel uppgifter");
  }
});

// Omdirigering efter inloggning
app.get("/go", (req, res) => {
  res.redirect(req.query.url);
});

app.listen(3000, () => console.log("Lyssnar på http://localhost:3000"));
