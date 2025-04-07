const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Zamzam123?', // CHANGE THIS
  database: 'expense_manager'
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB Connection Error:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// Register endpoint
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('📥 Register received:', req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal error' });
  }
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://192.168.1.180:8081`);
});

// CLAIMS
app.post('/expenses/submit', (req, res) => {
  const { category, amount, date, staffId, status } = req.body;

  if (!category || !amount || !date) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const sql = 'INSERT INTO claims (category, amount, date, staffId, status) VALUES (?, ?, ?, ?, ?)';
  const values = [category, amount, date, staffId || null, status || 'PENDING'];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting claim:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log('✅ Claim submitted:', result.insertId);
    return res.status(200).json({ message: 'Claim submitted successfully!' });
  });
});

app.get('/claims', (req, res) => {
  const sql = 'SELECT id, category, amount, date, status FROM claims ORDER BY id DESC LIMIT 5';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching claims:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json(results);
  });
});

app.get('/claims/user/:username', (req, res) => {
  const username = req.params.username;
  const sql = 'SELECT id, category, amount, date, status FROM claims WHERE staffId = ? ORDER BY date DESC';

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('❌ Error fetching user claims:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json(results);
  });
});

