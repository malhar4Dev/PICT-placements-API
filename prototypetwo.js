// Import required modules
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Set up database connection
const connection = mysql.createConnection({
  host: 'localhost',      // Replace with your MySQL host
  user: 'root',           // Replace with your MySQL username
  password: 'Malh2005',   // Replace with your MySQL password
  database: 'Placement_record' // Replace with your database name
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
  
  // Initialize the query
  let query = 'SELECT DISTINCT Company_name FROM dataset2';
  let queryParams = [];
  let whereAdded = false;

  // Handle years filter - now properly handles 'all years'
  if (years && years !== 'all years') {
    const yearList = years.split(',');
    query += ' WHERE year IN (?)';
    queryParams.push(yearList);
    whereAdded = true;
  }

  // Handle skills filter
  if (skills && skills !== 'all skills') {
    const skillList = skills.split(',');
    
    if (whereAdded) {
      query = `
        SELECT DISTINCT d.Company_name 
        FROM dataset2 d 
        JOIN skills_data s ON d.Company_name = s.Company
        WHERE d.year IN (?) AND s.Skill IN (${skillList.map(() => '?').join(',')})
      `;
      queryParams = [queryParams[0], ...skillList];
    } else {
      query = `
        SELECT DISTINCT d.Company_name 
        FROM dataset2 d 
        JOIN skills_data s ON d.Company_name = s.Company
        WHERE s.Skill IN (${skillList.map(() => '?').join(',')})
      `;
      queryParams = [...skillList];
    }
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

  if (!years) {
    res.status(400).send({ error: 'Years parameter is required' });
    return;
  }

  // Handle 'all years' and 'all companies' properly
  let query = 'SELECT year, Company_name, sal_lpa FROM dataset2';
  let whereClause = [];
  let queryParams = [];

  // Only add year condition if not 'all years'
  if (years && years !== 'all years') {
    const yearList = years.split(',');
    whereClause.push('year IN (?)');
    queryParams.push(yearList);
  }

  // Only add company condition if not 'all companies'
  if (companies && companies !== 'all companies') {
    const companyList = companies.split(',');
    whereClause.push('Company_name IN (?)');
    queryParams.push(companyList);
  }

  // Add WHERE clause if needed
  if (whereClause.length > 0) {
    query += ' WHERE ' + whereClause.join(' AND ');
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching LPA data:', err);
      res.status(500).send({ error: 'Error fetching LPA data' });
      return;
    }

    // Sort results by year in ascending order
    results.sort((a, b) => a.year.localeCompare(b.year));

    res.json(results);
  });
});

app.get('/skills', (req, res) => {
  const { companies } = req.query;

  if (!companies) {
    res.status(400).send({ error: 'Companies parameter is required' });
    return;
  }

  let query = 'SELECT Company, Skill FROM skills_data';
  let queryParams = [];

  // Only add WHERE clause if not 'all companies'
  if (companies !== 'all companies') {
    const companyList = companies.split(',');
    query += ' WHERE Company IN (?)';
    queryParams.push(companyList);
  }

  connection.query(query, queryParams, (err, results) => {
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
  let whereClause = [];
  let queryParams = [];

  // Handle year filter
  if (year && year !== 'all years') {
    whereClause.push('year = ?');
    queryParams.push(year);
  }

  // Handle company filter
  if (Company_name && Company_name !== 'all companies') {
    whereClause.push('Company_name = ?');
    queryParams.push(Company_name);
  }

  // Add WHERE clause if needed
  if (whereClause.length > 0) {
    query += ' WHERE ' + whereClause.join(' AND ');
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching filtered data:', err);
      res.status(500).send('Error fetching data');
      return;
    }

    // Calculate Male vs Female counts for any result set
    const maleCount = results.reduce((sum, row) => sum + row.Male, 0);
    const femaleCount = results.reduce((sum, row) => sum + row.Female, 0);

    res.json({
      data: results,
      chartData: {
        maleCount,
        femaleCount,
      },
    });
  });
});



app.get('/cgpa', (req, res) => {
  const { companies } = req.query;

  if (!companies) {
    res.status(400).send({ error: 'Companies parameter is required' });
    return;
  }

  let query = 'SELECT Company_name, cgpa_criteria FROM dataset2';
  let queryParams = [];

  // Only add WHERE clause if not 'all companies'
  if (companies !== 'all companies') {
    const companyList = companies.split(',');
    query += ' WHERE Company_name IN (?)';
    queryParams.push(companyList);
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching cgpa_criteria data:', err);
      res.status(500).send({ error: 'Error fetching cgpa_criteria data' });
      return;
    }

    // Group CGPA by company
    const groupedCGPA = results.reduce((acc, row) => {
      if (!acc[row.Company_name]) acc[row.Company_name] = [];
      acc[row.Company_name].push(row.cgpa_criteria);
      return acc;
    }, {});

    res.json(groupedCGPA);
  });
});

app.get('/top-companies', (req, res) => {
    const { years, criteria } = req.query;



    if (!years || !criteria) {
        res.status(400).send({ error: 'Years and criteria parameters are required' });
        return;
    }

    // Convert years to the correct format (e.g., "2022-23" -> "2022 -23")
    const formattedYears = years.split(',');


    let query;
    if (criteria === 'lpa') {
        query = `
            SELECT year, Company_name, sal_lpa 
            FROM dataset2 
            WHERE year IN (?) 
            ORDER BY year, sal_lpa DESC 
        `;
    } else if (criteria === 'placements') {
        query = `
            SELECT year, Company_name, Total 
            FROM dataset2 
            WHERE year IN (?) 
            ORDER BY year, Total DESC 
        `;
    } else {
        res.status(400).send({ error: 'Invalid criteria' });
        return;
    }

    connection.query(query, [formattedYears], (err, results) => {
        if (err) {
            console.error('Error fetching top companies:', err);
            res.status(500).send({ error: 'Error fetching data' });
            return;
        }

        // Group results by year and get top 10 for each year
        const groupedData = results.reduce((acc, row) => {
            if (!acc[row.year]) {
                acc[row.year] = [];
            }
            if (acc[row.year].length < 10) {
                acc[row.year].push(row);
            }
            return acc;
        }, {});

        res.json(groupedData);
    });
});

app.get('/top-skills', (req, res) => {
  const { years } = req.query;

  if (!years) {
      return res.status(400).json({ error: "Years parameter is required" });
  }

  const yearList = years.split(',');

  const query = `
      WITH RECURSIVE SkillSplit AS (
          SELECT d.year, 
                 s.Company, 
                 SUBSTRING_INDEX(s.Skill, ',', 1) AS Skill, 
                 SUBSTRING(s.Skill, LOCATE(',', s.Skill) + 1) AS RemainingSkills
          FROM skills_data s
          JOIN dataset2 d ON s.Company = d.Company_name
          WHERE d.year IN (${yearList.map(() => '?').join(',')})
          
          UNION ALL
          
          SELECT year, 
                 Company, 
                 SUBSTRING_INDEX(RemainingSkills, ',', 1), 
                 SUBSTRING(RemainingSkills, LOCATE(',', RemainingSkills) + 1)
          FROM SkillSplit
          WHERE RemainingSkills LIKE '%,%'
      )
      SELECT Skill, COUNT(*) AS skill_count
      FROM SkillSplit
      WHERE Skill IS NOT NULL AND Skill <> ''
      GROUP BY Skill
      ORDER BY skill_count DESC
      LIMIT 7;
  `;

  connection.query(query, yearList, (err, results) => {
      if (err) {
          console.error('Error fetching top skills:', err);
          return res.status(500).json({ error: 'Error fetching top skills' });
      }

      const skills = results.map(row => row.Skill);
      const skillCounts = results.map(row => row.skill_count);

      res.json({ skills, skillCounts });
  });
});

// Add this endpoint to prototypetwo.js
app.get('/placement-stats', (req, res) => {
  const { years } = req.query;

  if (!years) {
    res.status(400).json({ error: 'Years parameter is required' });
    return;
  }

  let query = `
    SELECT 
      year,
      COUNT(DISTINCT Company_name) as total_companies,
      SUM(Total) as total_students,
      SUM(ce) as ce_students,
      SUM(entc) as entc_students,
      SUM(it) as it_students
    FROM dataset2
  `;

  let queryParams = [];
  
  if (years !== 'all years') {
    const yearList = years.split(',');
    query += ' WHERE year IN (?)';
    queryParams.push(yearList);
  }

  query += ' GROUP BY year';

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching placement stats:', err);
      res.status(500).json({ error: 'Error fetching placement stats' });
      return;
    }

    res.json(Array.isArray(results) ? results : []);
  });
});


// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/prototype2/other.html');
});

var path = require('path');
app.use(express.static(path.join(__dirname, 'prototype2'))); 

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});