const express = require('express');
const mysql = require('mysql2');
const app = express();

// Set up database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Malh2005',
  database: 'Placement_record',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database!');
});

// Fetch all data
app.get('/dataset2', (req, res) => {
  const query = 'SELECT * FROM dataset2';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Fetch company names
app.get('/cnames', (req, res) => {
  const { year } = req.query;
  let query = 'SELECT DISTINCT Company_name FROM dataset2';
  const queryParams = [];

  if (year && year !== 'all years') {
    query += ' WHERE year = ?';
    queryParams.push(year);
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

// Fetch LPA data
app.get('/lpa', (req, res) => {
  const { years, companies } = req.query;

  if (!years || !companies) {
    res.status(400).send({ error: 'Years and Companies are required' });
    return;
  }

  const yearList = years.split(',');
  const companyList = companies.split(',');

  const query = `
    SELECT year, Company_name, sal_lpa 
    FROM dataset2 
    WHERE year IN (?) AND Company_name IN (?)
  `;
  connection.query(query, [yearList, companyList], (err, results) => {
    if (err) {
      console.error('Error fetching LPA data:', err);
      res.status(500).send({ error: 'Error fetching LPA data' });
      return;
    }
    res.json(results);
  });
});

// Fetch filtered data for comparison
app.get('/filtered_data', (req, res) => {
  const { years, companies } = req.query;

  if (!years || !companies) {
    res.status(400).send({ error: 'Years and Companies are required' });
    return;
  }

  let yearList = ['2019 -20', '2020 -21', '2021 -22', '2022 -23', '2023 -24', '2024 -25'];
  if (years !== 'all years') {
    yearList = years.split(',');
  }

  const companyList = companies.split(',');

  const query = `
    SELECT year, Company_name, Male, Female 
    FROM dataset2 
    WHERE year IN (?) AND Company_name IN (?)
  `;
  connection.query(query, [yearList, companyList], (err, results) => {
    if (err) {
      console.error('Error fetching filtered data:', err);
      res.status(500).send('Error fetching data');
      return;
    }

    // Group data by year and company
    const groupedData = results.reduce((acc, row) => {
      const key = `${row.year}-${row.Company_name}`;
      if (!acc[key]) {
        acc[key] = { year: row.year, company: row.Company_name, Male: 0, Female: 0 };
      }
      acc[key].Male += row.Male;
      acc[key].Female += row.Female;
      return acc;
    }, {});

    // Prepare chart data
    const labels = Object.keys(groupedData).map(key => `${groupedData[key].year} - ${groupedData[key].company}`);
    const maleData = Object.values(groupedData).map(item => item.Male);
    const femaleData = Object.values(groupedData).map(item => item.Female);

    res.json({
      data: results,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Male',
            data: maleData,
            backgroundColor: '#4CAF50',
          },
          {
            label: 'Female',
            data: femaleData,
            backgroundColor: '#FF6384',
          },
        ],
      },
    });
  });
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/website/visualiseit.html');
});

// Serve static files
app.use(express.static('website'));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});