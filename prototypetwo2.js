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
app.get('/dataset2', (req, res) => {
  const query = 'SELECT * FROM dataset2';
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
  const { years, skills } = req.query;

  if (!years) {
      res.status(400).send({ error: 'Years parameter is required' });
      return;
  }

  const yearList = years.split(',');
  let query = 'SELECT DISTINCT Company_name FROM dataset2 WHERE year IN (?)';
  let queryParams = [yearList];

  // If skills are provided, filter companies based on both year & skill
  if (skills) {
      const skillList = skills.split(',');
      query = `
          SELECT DISTINCT d.Company_name 
          FROM dataset2 d 
          JOIN skills_data s ON d.Company_name = s.Company
          WHERE d.year IN (?) AND s.Skill IN (${skillList.map(() => '?').join(',')})
      `;
      queryParams = [yearList, ...skillList];
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





app.get('/lpa', (req, res) => {
  const { years, companies } = req.query;

  if (!years || !companies) {
    res.status(400).send({ error: 'Years and Companies are required' });
    return;
  }

  const yearList = years.split(',');
  const companyList = companies.split(',');

  let query = 'SELECT year, Company_name, sal_lpa FROM dataset2 WHERE year IN (?) AND Company_name IN (?)';
  const queryParams = [yearList, companyList];

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching LPA data:', err);
      res.status(500).send({ error: 'Error fetching LPA data' });
      return;
    }
    res.json(results);
  });
});


app.get('/skills', (req, res) => {
  const { companies } = req.query;

  if (!companies) {
    res.status(400).send({ error: 'Companies parameter is required' });
    return;
  }

  const companyList = companies.split(',');

  let query = 'SELECT Company, Skill FROM skills_data WHERE Company IN (?)';
  connection.query(query, [companyList], (err, results) => {
    if (err) {
      console.error('Error fetching skills:', err);
      res.status(500).send({ error: 'Error fetching skills' });
      return;
    }

    // Group skills by company
    const groupedSkills = results.reduce((acc, row) => {
      if (!acc[row.Company]) acc[row.Company] = [];
      acc[row.Company].push(row.Skill);
      return acc;
    }, {});

    res.json(groupedSkills);
  });
});



app.get('/filtered_data', (req, res) => {
  const { year, Company_name } = req.query;

  let query = 'SELECT * FROM dataset2';
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

app.get('/cgpa', (req, res) => {
  const { companies } = req.query;

  if (!companies) {
    res.status(400).send({ error: 'Companies parameter is required' });
    return;
  }

  const companyList = companies.split(',');

  let query = 'SELECT Company_name, cgpa_criteria FROM dataset2 WHERE Company_name IN (?)';
  connection.query(query, [companyList], (err, results) => {
    if (err) {
      console.error('Error fetching cgpa_criteria data:', err);
      res.status(500).send({ error: 'Error fetching cgpa_criteria data' });
      return;
    }

    // Group CGPA by company
    const groupedCGPA = results.reduce((acc, row) => {
      if (!acc[row.Company_name]) acc[row.Company_name] = [];
      acc[row.Company_name].push(row.cgpa_criteria); // Ensure the correct column name is used
      return acc;
    }, {});

    // Ensure all companies in the request have an array, even if empty
    companyList.forEach(company => {
      if (!groupedCGPA[company]) {
        groupedCGPA[company] = [];
      }
    });

    res.json(groupedCGPA);
  });
});




// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/prototype2/dashboard3.html');
});

var path = require('path');
app.use(express.static(path.join(__dirname, 'prototype2'))); 
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
