document.getElementById('analyze-button').addEventListener('click', async () => {
    // Ensure selectedYearsList is defined and contains the selected years
    const selectedYearsList = window.selectedYears || []; // Fallback to an empty array if not defined
    const selectedSkillsList = window.selectedSkills || []; // Fallback to an empty array if not defined


    try {
        // Fetch companies based on selected years and skills
        const response = await fetch(`/cnames?years=${selectedYearsList.join(',')}${selectedSkillsList.length > 0 ? `&skills=${selectedSkillsList.join(',')}` : ''}`);
        const companies = await response.json();
        // Update the company dropdown
        const companyMenu = document.querySelector('.comp-names');
        companyMenu.innerHTML = ''; // Clear previous items

        companies.forEach(company => {
            const item = document.createElement('div');
            item.className = 'item';
            item.textContent = company.Company_name;
            companyMenu.appendChild(item);
        });

    } catch (error) {
        console.error('Error fetching companies:', error);
    }
});


// complist.js
document.addEventListener('DOMContentLoaded', function() {
    // This will run when the complist tab is loaded
    const complistTab = document.querySelector('.complist');
    
    // Function to update placement stats
    async function updatePlacementStats(selectedYears) {
        try {
            const response = await fetch(`/placement-stats?years=${selectedYears.join(',')}`);
            const statsData = await response.json();
            
            const compTotalDiv = document.querySelector('.comp-total');
            compTotalDiv.innerHTML = '';
            
            statsData.forEach(yearData => {
                const yearStats = document.createElement('div');
                yearStats.className = 'year-stats';
                yearStats.innerHTML = `
                    <h3>Placement Statistics for ${yearData.year}</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${yearData.total_companies}</div>
                            <div class="stat-label">Companies Visited</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${yearData.total_students}</div>
                            <div class="stat-label">Total Students Placed</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${yearData.ce_students}</div>
                            <div class="stat-label">CE Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${yearData.entc_students}</div>
                            <div class="stat-label">ENTC Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${yearData.it_students}</div>
                            <div class="stat-label">IT Students</div>
                        </div>
                    </div>
                `;
                compTotalDiv.appendChild(yearStats);
            });
            
        } catch (error) {
            console.error('Error fetching placement stats:', error);
        }
    }
    
    // Call this function when the complist tab is activated
    document.getElementById('complist').addEventListener('click', function() {
        if (window.selectedYears && window.selectedYears.length > 0) {
            updatePlacementStats(window.selectedYears);
        } else {
            // Default to all years if none selected
            updatePlacementStats(['all years']);
        }
    });
    
    // Also call it when the analyze button is clicked
    document.getElementById('analyze-button')?.addEventListener('click', function() {
        if (window.selectedYears && window.selectedYears.length > 0) {
            updatePlacementStats(window.selectedYears);
        }
    });
});