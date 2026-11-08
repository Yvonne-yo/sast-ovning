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

// // Sök produkter   -Övningens sårbara kod 2 stycken
app.get("/search", (req, res) => {
  const q = req.query.q;
  const sql = "SELECT * FROM products WHERE name LIKE '%" + q + "%'";
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).send("Fel");
    // Visar sökordet direkt på sidan
    res.send("<h1>Resultat för " + q + "</h1>" + JSON.stringify(rows));
  });
});

// Rättning av // Sök produkter
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const sql = `SELECT * FROM products WHERE name LIKE ?`;
  const searchTerm = `%${q}%`;

  db.all(sql, [searchTerm], (err, rows) => {
    if (err) {
      return res.status(500).send('Ett fel uppstod vid sökningen.');
    }

    // Undvik XSS genom att undvika rå HTML eller sanera/escapea q
    const escapedQ = escapeHtml(q); 
    res.send(`<h1>Resultat för ${escapedQ}</h1>` + JSON.stringify(rows));
  });
});
// Förklaring
// Vad som har ändrats och varför:
// 1. Mot SQL-injektion (Parameterized Queries):
// 	• Innan: Du satte in q direkt i strängen (SELECT * FROM products WHERE name LIKE % + q + %), vilket låter en angripare köra godtycklig SQL-kod.
// 	• Efter: Använd frågetecken-platshållare (?) och skicka värdet som en parameter ([searchTerm]). Då behandlar databasen alltid inmatningen som ren data och aldrig som exekverbar kod.
// 2. Mot XSS (Cross-Site Scripting):
// 	• Innan: Du skrev ut q direkt i HTML-taggen (<h1>Resultat för + q + </h1>). Om en användare söker efter <script>stöldkod()</script> kommer skriptet att köras i webbläsaren.
// 	• Efter: Du bör alltid "escapea" eller undvika att skriva ut rå användarindata direkt i HTML (skapa en escapeHtml()-funktion eller använd en mallmotor som automatiskt escapar variabler).
// Rättning slut

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
