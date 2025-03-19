// Complete rewrite of lpagraph.js with visibility fixes
document.addEventListener('DOMContentLoaded', function () {
    const lpaGraphsIcon = document.getElementById('lpa-graphs');
    const lpaGraphsContainer = document.getElementById('lpa-graphs-container');
    const lpaGraphsTab = document.querySelector('.lpa-graphs');

    // Make sure the container exists
    if (!lpaGraphsContainer) {
        console.error('LPA graphs container not found');
        return;
    }

    lpaGraphsIcon.addEventListener("click", function () {
        if (this.classList.contains('disabled')) {
            console.log('LPA icon is disabled');
            return;
        }

        console.log('LPA icon clicked, showing tab');

        // Remove active class from all icons and add to this one
        document.querySelectorAll('.dash-nav i').forEach(icon => icon.classList.remove('active'));
        this.classList.add('active');

        // Hide all tabs
        document.querySelectorAll('.content > div').forEach(tab => {
            tab.style.display = 'none';
            console.log(`Hiding tab: ${tab.className}`);
        });

        // Explicitly show the LPA graphs tab
        if (lpaGraphsTab) {
            lpaGraphsTab.style.display = 'flex';
            console.log('Setting lpaGraphsTab display to flex');
        } else {
            console.error('LPA graphs tab element not found');
        }

        // Generate charts only if we have selected companies
        if (window.selectedCompanies && window.selectedCompanies.length > 0) {
            console.log(`Generating charts for: ${window.selectedCompanies.join(', ')}`);
            generateLPALineCharts(window.selectedCompanies);
        } else {
            console.log('No companies selected, showing message');
            lpaGraphsContainer.innerHTML = '<div class="no-data">Please select at least one company and analyze data first</div>';
        }
    });
});

// Function to generate LPA line charts
async function generateLPALineCharts(companies) {
    console.log('Starting to generate LPA line charts');
    const lpaGraphsContainer = document.getElementById('lpa-graphs-container');

    if (!lpaGraphsContainer) {
        console.error('LPA graphs container not found');
        return;
    }

    // Make sure the container is visible
    lpaGraphsContainer.style.display = 'block';

    // Clear previous content
    lpaGraphsContainer.innerHTML = `
        <h3>📈 LPA Trends Over Time</h3>
        <div class="charts-wrapper"></div>
    `;

    const chartsWrapper = lpaGraphsContainer.querySelector('.charts-wrapper');

    if (!companies || companies.length === 0) {
        chartsWrapper.innerHTML = '<div class="no-data">No companies selected</div>';
        return;
    }

    try {
        for (const company of companies) {
            console.log(`Fetching LPA data for ${company}`);

            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            chartContainer.style.width = '45%';
            chartContainer.style.height = '300px';
            chartContainer.style.margin = '10px';
            chartsWrapper.appendChild(chartContainer);

            const chartTitle = document.createElement('h4');
            chartTitle.textContent = company;
            chartContainer.appendChild(chartTitle);

            // Show loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading';
            loadingIndicator.textContent = 'Loading data...';
            chartContainer.appendChild(loadingIndicator);

            try {
                const response = await fetch(`/lpa?years=all%20years&companies=${company}`);
                const lpaData = await response.json();

                // Remove loading indicator
                chartContainer.removeChild(loadingIndicator);

                if (!lpaData || lpaData.length === 0) {
                    chartContainer.innerHTML = `<h4>${company}</h4><div class="no-data">No LPA data available</div>`;
                    continue;
                }

                console.log(`Data received for ${company}:`, lpaData);

                const canvas = document.createElement('canvas');
                chartContainer.appendChild(canvas);

                const years = lpaData.map(item => item.year);
                const lpaValues = lpaData.map(item => parseFloat(item.sal_lpa || 0));

                const ctx = canvas.getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: [{
                            label: `LPA (in ₹)`,
                            data: lpaValues,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'LPA Offered (₹)'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            }
                        }
                    }
                });

                console.log(`Chart created for ${company}`);
            } catch (error) {
                console.error(`Error fetching data for ${company}:`, error);
                chartContainer.innerHTML = `<h4>${company}</h4><div class="error-message">Error: ${error.message}</div>`;
            }
        }
    } catch (error) {
        console.error('Error in chart generation loop:', error);
        chartsWrapper.innerHTML += `<div class="error-message">Error loading charts: ${error.message}</div>`;
    }

    console.log('Finished generating all LPA charts');
}