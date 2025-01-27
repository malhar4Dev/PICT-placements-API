// Import required modules
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Set up database connection
const connection = mysql.createConnection({
  host: 'localhost',      // Replace with your MySQL host
  user: 'root',           // Replace with your MySQL username
  password: 'Malh2005',           // Replace with your MySQL password
  database: 'Placement_record'     // Replace with your database name
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
app.get('/dataset', (req, res) => {
  const query = 'SELECT * FROM dataset';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
      return;
    }
    // Send the results as a JSON response
    res.json(results);
  });
});





app.get('/cnames', (req, res) => {
  // Get the 'year' parameter from the query
  const { year } = req.query;
  // Construct the SQL query
  let query = 'SELECT DISTINCT Company_name FROM dataset';
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

// app.get('/filtered_data', (req, res) => {
//   const { year,Company_name } = req.query;

//   let query = 'SELECT * FROM dataset';
//   const queryParams = [];

//   if (year && year !== 'all years') {
//       query += ' WHERE year = ? && Company_name = ?';
//       queryParams.push(year,Company_name);
//   }

//   connection.query(query, queryParams, (err, results) => {
//     if (err) {
//         console.error('Error fetching company names:', err);
//         res.status(500).send('Error fetching data');
//         return;
//     }
//     res.json(results);
// });
// });
app.get('/lpa', (req, res) => {
  const { year, Company_name } = req.query;

  // Start constructing the query
  let query = 'SELECT sal_lpa FROM dataset';
  const queryParams = [];

  // Add conditions dynamically
  const conditions = [];
  if (year && year !== 'all years') {
    conditions.push('year = ?');
    queryParams.push(year);
  }
  if (Company_name && Company_name !== 'all companies') {
    conditions.push('Company_name = ?');
    queryParams.push(Company_name);
  }

  // Combine conditions into the WHERE clause if any exist
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Execute the query
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching LPA data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});



app.get('/filtered_data', (req, res) => {
  const { year, Company_name } = req.query;

  let query = 'SELECT * FROM dataset';
  const queryParams = [];

  if (year && year !== 'all years') {
    query += ' WHERE year = ?';
    queryParams.push(year);

    if (Company_name && Company_name !== 'all companies') {
      query += ' AND Company_name = ?';
      queryParams.push(Company_name);
    }
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching filtered data:', err);
      res.status(500).send('Error fetching data');
      return;
    }

    // If a single company is selected, calculate Male vs Female counts
    if (Company_name && Company_name !== 'all companies') {
      const maleCount = results.reduce((sum, row) => sum + row.Male, 0);
      const femaleCount = results.reduce((sum, row) => sum + row.Female, 0);

      res.json({
        data: results,
        chartData: {
          maleCount,
          femaleCount,
        },
      });
    } else {
      // If multiple companies or "all companies" are selected
      res.json({ data: results });
    }
  });
});





// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/website/data.html');
});

var path = require('path');
app.use(express.static(path.join(__dirname, 'website'))); 
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
