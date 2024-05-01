const express=require("express")
const app=express()
const sqlite3=require("sqlite3")

const PORT = 9000;

//console.log(sqlite,jwtToken)

const db = new sqlite3.Database('./collection.db', err => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database');
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        });
    }
});

const jwt = require('json-web-token');

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  // Verify the token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    // Attach the decoded token payload to the request object for further use
    req.user = decoded;
    next();
  });
};



module.exports = verifyToken;


app.post("/login",(request,response)=>{
  const { username, password } = req.body;
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // Check if the username exists in the database
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    bcrypt.compare(password, user.password, (bcryptErr, result) => {
      if (bcryptErr) {
        console.error('Bcrypt error:', bcryptErr.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // If passwords match, generate JWT token and send it as response
      if (result) {
        const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
        return res.json({ token });
      } else {
        // If passwords do not match, return an error
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  });
})

app.post("/register",(request,response)=>{
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Bcrypt error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Insert the user into the database
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], err => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'User registered successfully' });
    });
  });
})
