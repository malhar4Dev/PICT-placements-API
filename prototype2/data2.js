const express = require("express");
const mysql = require("mysql2");
const app = express();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Malh2005",
    database: "Placement_record",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to MySQL database!");
});

// Helper function to get all available years dynamically
const getAllYears = async () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT DISTINCT year FROM dataset2", (err, results) => {
            if (err) reject(err);
            resolve(results.map(row => row.year));
        });
    });
};

// Fetch all company names based on selected years
app.get("/cnames", async (req, res) => {
    let { years } = req.query;
    const allYears = await getAllYears();

    if (years === "all years") {
        years = allYears;
    } else {
        years = years.split(",");
    }

    const query = `SELECT DISTINCT Company_name FROM dataset2 WHERE year IN (?)`;
    connection.query(query, [years], (err, results) => {
        if (err) {
            res.status(500).send("Error fetching companies");
            return;
        }
        res.json(results);
    });
});

// Fetch LPA data for selected years and companies
app.get("/lpa", async (req, res) => {
    let { years, companies } = req.query;
    const allYears = await getAllYears();

    if (years === "all years") years = allYears;
    else years = years.split(",");

    companies = companies.split(",");

    const query = `
        SELECT year, Company_name, AVG(sal_lpa) AS avg_lpa
        FROM dataset2
        WHERE year IN (?) AND Company_name IN (?)
        GROUP BY year, Company_name
    `;

    connection.query(query, [years, companies], (err, results) => {
        if (err) {
            res.status(500).send({ error: "Error fetching LPA data" });
            return;
        }
        res.json(results);
    });
});

// Fetch filtered placement data for comparison
app.get("/filtered_data", async (req, res) => {
    let { years, companies } = req.query;
    const allYears = await getAllYears();

    if (years === "all years") years = allYears;
    else years = years.split(",");

    companies = companies.split(",");

    const query = `
        SELECT year, Company_name, Male, Female 
        FROM dataset2 
        WHERE year IN (?) AND Company_name IN (?)
    `;

    connection.query(query, [years, companies], (err, results) => {
        if (err) {
            res.status(500).send("Error fetching data");
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
        const labels = Object.keys(groupedData).map((key) => key);
        const maleData = Object.values(groupedData).map((item) => item.Male);
        const femaleData = Object.values(groupedData).map((item) => item.Female);

        res.json({
            data: results,
            chartData: {
                labels,
                datasets: [
                    {
                        label: "Male",
                        data: maleData,
                        backgroundColor: "#4CAF50",
                    },
                    {
                        label: "Female",
                        data: femaleData,
                        backgroundColor: "#FF6384",
                    },
                ],
            },
        });
    });
});

// Serve the frontend HTML file
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/website/visualise.html");
});

// Serve static files from "website" directory
app.use(express.static("website"));

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
