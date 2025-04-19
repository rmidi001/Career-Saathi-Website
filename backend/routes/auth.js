const express = require('express');
const router = express.Router();
const db = require('../db');

// Register
router.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;
  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).send('User already exists or DB error');
    }
    res.send('✅ Registered successfully');
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?';
  db.query(sql, [username, password, role], (err, results) => {
    if (err) return res.status(500).send('DB error');
    if (results.length === 0) return res.status(401).send('Invalid credentials');
    res.json(results[0]);
  });
});

module.exports = router;
