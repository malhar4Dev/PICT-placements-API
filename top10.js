document.addEventListener('DOMContentLoaded', function () {
    const analyzeButton = document.getElementById('analyze-button');
    const criteriaRadios = document.querySelectorAll('input[name="criteria"]');
    const complistTab = document.getElementById('complist');
    const overallAnalysisContainer = document.getElementById('overall-analysis-container');

    let currentCharts = []; // To keep track of all chart instances

    // Function to generate the graph
    async function generateGraph(criteria) {
        if (selectedYears.length === 0) {
            alert('Please select at least one year.');
            return;
        }

        // Convert selected years to the correct format (e.g., "2022-23" -> "2022 -23")
        const formattedYears = selectedYears.join(',');

        try {
            const response = await fetch(`/top-companies?years=${formattedYears}&criteria=${criteria}`);
            const data = await response.json();

            console.log('Data from server:', data); // Debug: Log the data from the server

            // Clear previous charts
            currentCharts.forEach(chart => chart.destroy());
            currentCharts = []; // Reset the array
            overallAnalysisContainer.innerHTML = ''; // Clear previous content

            // Create a new canvas and chart for each year
            Object.entries(data).forEach(([year, companies]) => {

                // Create a new canvas for this year
                const canvasWrapper = document.createElement('div');
                canvasWrapper.classList.add('canvas-wrapper');

                const canvas = document.createElement('canvas');
                canvas.classList.add('top10');
                canvas.id = `chart-${year.replace(/ /g, '-')}`; // Replace spaces with hyphens for valid ID

                canvasWrapper.appendChild(canvas);
                overallAnalysisContainer.appendChild(canvasWrapper);

                // Prepare data for the chart
                const labels = companies.map(company => company.Company_name);
                const dataset = {
                    label: `${year} - ${criteria === 'lpa' ? 'LPA' : 'Placements'}`,
                    data: companies.map(company => criteria === 'lpa' ? company.sal_lpa : company.Total),
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                    borderWidth: 1
                };


                // Create a new chart for this year
                const chart = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [dataset]
                    },
                    options: {
                        responsive: true, // Make the chart responsive
                        maintainAspectRatio: false, // Allow custom height and width
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: criteria === 'lpa' ? 'LPA' : 'Number of Placements'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Companies'
                                }
                            }
                        }
                    }
                });

                // Store the chart instance
                currentCharts.push(chart);
            });
        } catch (error) {
            console.error('Error fetching top companies data:', error);
        }
    }

    // Event listener for "Analyze It" button
    analyzeButton.addEventListener('click', async () => {
        // Switch to the complist tab
        document.querySelectorAll('.dash-nav i').forEach(icon => icon.classList.remove('active'));
        document.getElementById('complist').classList.add('active');
        document.querySelectorAll('.content > div').forEach(tab => tab.style.display = 'none');
        document.querySelector('.complist').style.display = 'flex';

        // Generate graph with default criteria (LPA)
        generateGraph('lpa');
    });

    // Event listener for radio buttons
    criteriaRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedCriteria = document.querySelector('input[name="criteria"]:checked').value;
            generateGraph(selectedCriteria);
        });
    });
});