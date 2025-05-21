document.getElementById('analyze-button').addEventListener('click', async () => {

    // Prepare selected years for API calls
    const selectedYearsList = selectedYears.join(',');

    fetchTopSkills(selectedYearsList);
});

function fetchTopSkills(selectedYears) {
    fetch(`/top-skills?years=${selectedYears}`)
        .then(response => response.json())
        .then(data => {
            window.topSkillsData = data; // Store the fetched data globally
            updatePolarChart(); // Update the chart when user switches to Piechart tab
        })
        .catch(error => console.error('Error fetching top skills:', error));
}

// Update the chart only when Piechart tab is selected
document.getElementById('piechart').addEventListener('click', () => {
    if (window.topSkillsData) {
        updatePolarChart();
    }
});

function updatePolarChart() {
    const ctx = document.getElementById('skills-polar-chart').getContext('2d');

    // Destroy existing chart if it exists
    if (Chart.getChart("skills-polar-chart")) {
        Chart.getChart("skills-polar-chart").destroy();
    }

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: window.topSkillsData.skills,
            datasets: [{
                data: window.topSkillsData.skillCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(0, 128, 128, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(0, 128, 128, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}
