const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./journal.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                mood TEXT NOT NULL,
                date TEXT NOT NULL
            )
        `);
    }
});

// API to get all entries
app.get('/entries', (req, res) => {
    db.all('SELECT * FROM entries ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// API to add a new entry
app.post('/entries', (req, res) => {
    const { text, mood, date } = req.body;
    if (!text || !mood || !date) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.run(
        'INSERT INTO entries (text, mood, date) VALUES (?, ?, ?)',
        [text, mood, date],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, text, mood, date });
            }
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});