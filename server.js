const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Route to get all users
app.get('/users', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    const users = JSON.parse(data).users;
    res.json(users);
  });
});

// Route to get a user by ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    const users = JSON.parse(data).users;
    const user = users.find(user => user.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Route to create a new user
app.post('/users', (req, res) => {
  const newUser = req.body;
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    const users = JSON.parse(data).users;
    newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
    users.push(newUser);

    fs.writeFile('db.json', JSON.stringify({ users }), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).json(newUser);
    });
  });
});

// Route to update a user by ID
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUser = req.body;
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    let users = JSON.parse(data).users;
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
      updatedUser.id = userId;
      users[userIndex] = updatedUser;

      fs.writeFile('db.json', JSON.stringify({ users }), 'utf8', (err) => {
        if (err) {
          res.status(500).send('Internal Server Error');
          return;
        }
        res.json(updatedUser);
      });
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Route to delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    let users = JSON.parse(data).users;
    const newUsers = users.filter(user => user.id !== userId);

    if (newUsers.length !== users.length) {
      fs.writeFile('db.json', JSON.stringify({ users: newUsers }), 'utf8', (err) => {
        if (err) {
          res.status(500).send('Internal Server Error');
          return;
        }
        res.status(204).send();
      });
    } else {
      res.status(404).send('User not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
