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


