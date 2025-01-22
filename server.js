// Import required modules
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Set up database connection
const connection = mysql.createConnection({
  host: 'localhost',      // Replace with your MySQL host
  user: 'root',           // Replace with your MySQL username
  password: 'Malh2005',           // Replace with your MySQL password
  database: 'Placement_data'     // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database!');
});

// Define a route to fetch data
app.get('/sample_data1', (req, res) => {
  const query = 'SELECT * FROM sample_data1';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
      return;
    }
    // Send the results as a JSON response
    res.json(results);
  });
});


// app.get('/cnames', (req, res) => {
//   const query = 'SELECT Company_name FROM sample_data1';
//   connection.query(query, (err, results) => {
//     if (err) {
//       res.status(500).send('Error fetching data');
//       return;
//     }
//     // Send the results as a JSON response
//     res.json(results);
//   });
// });


app.get('/cnames', (req, res) => {
  // Get the 'year' parameter from the query
  const { year } = req.query;
  // Construct the SQL query
  let query = 'SELECT DISTINCT Company_name FROM sample_data1';
  const queryParams = [];

  if (year && year !== 'all years') {
      query += ' WHERE year = ?';
      queryParams.push(year);
  }

  // Execute the query
  connection.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error fetching company names:', err);
          res.status(500).send('Error fetching data');
          return;
      }
      res.json(results);
  });
});

app.get('/filtered_data', (req, res) => {
  const { year,Company_name } = req.query;

  let query = 'SELECT * FROM sample_data1';
  const queryParams = [];

  if (year && year !== 'all years') {
      query += ' WHERE year = ? && Company_name = ?';
      queryParams.push(year,Company_name);
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
        console.error('Error fetching company names:', err);
        res.status(500).send('Error fetching data');
        return;
    }
    res.json(results);
});
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/website/newhome.html');
});

var path = require('path');
app.use(express.static(path.join(__dirname, 'website'))); 
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
