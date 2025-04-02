let dropdownBtns = document.getElementsByClassName('dropdown-btn');
let dropdownMenus = document.getElementsByClassName('dropdown-menu');
let items = document.querySelectorAll('.item');
let selectedYears = [];
let selectedCompanies = [];
let selectedSkills = [];

// Close dropdowns when clicking outside
window.addEventListener('click', function () {
    closemenu();
});

// Loop through all dropdown buttons
for (let i = 0; i < dropdownBtns.length; i++) {
    let dropdownBtn = dropdownBtns[i];
    let dropdownMenu = dropdownMenus[i];

    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Check if the dropdown is for "Company" or "Skill" and no year is selected
        if (
            (dropdownMenu.classList.contains('comp-menu') || dropdownMenu.classList.contains('skill-menu')) &&
            selectedYears.length === 0
        ) {
            alert('Please select at least one year first!');
            return; // Prevent the dropdown from opening
        }

        togglemenu(dropdownMenu); // Pass the menu to the toggle function
    });
}

// Event listeners for all item clicks
items.forEach(item => item.addEventListener('click', itemClickHandler));

function togglemenu(dropdownMenu) {
    dropdownMenu.classList.toggle('open');
}

function closemenu() {
    for (let i = 0; i < dropdownMenus.length; i++) {
        dropdownMenus[i].classList.remove('open');
    }
}

function itemClickHandler(e) {
    e.stopPropagation();

    // Get the parent dropdown menu of the clicked item
    let dropdownMenu = e.target.closest('.dropdown-menu');
    let selectedItemText = e.target.innerText;

    // Determine which dropdown menu was clicked
    if (dropdownMenu.classList.contains('year-menu')) {
        handleSelection('year', selectedItemText, selectedYears, 'year-tags-container', 'selected-year');
    } else if (dropdownMenu.classList.contains('comp-menu')) {
        handleSelection('company', selectedItemText, selectedCompanies, 'company-tags-container', 'selected-company');
    } else if (dropdownMenu.classList.contains('skill-menu')) {
        handleSelection('skill', selectedItemText, selectedSkills, 'skill-tags-container', 'selected-skill');
    }

    // Close the dropdown menu
    closemenu();
}

function handleSelection(dropdownType, selectedItemText, selectedItemsArray, containerId, selectedTextId) {
    if (selectedItemText.toLowerCase().includes("all")) {
        // Clear previous selections
        selectedItemsArray.length = 0;
        document.getElementById(containerId).innerHTML = '';
        disableDropdownItems(`.${dropdownType}-menu .item:not(.disabled)`);

        // Add "All" as the only selected item
        addTag(containerId, selectedItemText, selectedItemsArray, selectedTextId);

        // Fetch all companies if "All years" is selected
        if (dropdownType === 'year') {
            fetchCompanies(['all']);
        }
    } else {
        // Add the selected item
        addTag(containerId, selectedItemText, selectedItemsArray, selectedTextId);

        // Fetch companies for selected years
        if (dropdownType === 'year') {
            fetchCompanies(selectedItemsArray);
        }
    }

    // Disable the selected item in the dropdown
    disableDropdownItem(selectedItemText, dropdownType);

    // Disable the skill dropdown if a company is selected
    if (dropdownType === 'company') {
        disableSkillDropdown();
    } else if (dropdownType === 'year') {
        // Enable skill dropdown if no companies are selected
        if (selectedCompanies.length === 0) {
            enableSkillDropdown();
        }
    }
}

document.getElementById('skill-tags-container').addEventListener('click', async () => {
    if (selectedYears.length === 0) {
        alert('Please select at least one year first!');
        return;
    }

    const selectedYearsList = selectedYears.join(',');
    const selectedSkillsList = selectedSkills.length > 0 ? selectedSkills.join(',') : null;

    try {
        // Fetch companies filtered by year & skill
        const response = await fetch(`/cnames?years=${selectedYearsList}${selectedSkillsList ? `&skills=${selectedSkillsList}` : ''}`);
        const companies = await response.json();

        // Update the company dropdown
        const companyMenu = document.querySelector('.comp-menu');
        companyMenu.innerHTML = '<div class="item">All Companies</div>';

        companies.forEach(company => {
            const item = document.createElement('div');
            item.className = 'item';
            item.textContent = company.Company_name;
            item.onclick = (e) => itemClickHandler(e);
            companyMenu.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
    }
});


// Function to fetch company names based on selected years
// async function fetchCompanies(selectedYears) {
//     try {
//         // Fetch companies for all selected years
//         const response = await fetch(`/cnames?years=${selectedYears.join(',')}`);
//         const data = await response.json();

//         // Clear the company dropdown
//         const companyMenu = document.querySelector('.comp-menu');
//         companyMenu.innerHTML = '<div class="item">All Companies</div>';

//         // Add fetched companies to the dropdown
//         data.forEach(company => {
//             const item = document.createElement('div');
//             item.className = 'item';
//             item.textContent = company.Company_name;

//             // Use an arrow function to ensure the event object is passed correctly
//             item.onclick = (e) => itemClickHandler(e);

//             companyMenu.appendChild(item);
//         });
//     } catch (error) {
//         console.error('Error fetching companies:', error);
//     }
// }

async function fetchCompanies() {
    if (selectedYears.length === 0) {
        alert('Please select at least one year first!');
        return;
    }

    const selectedYearsList = selectedYears.join(',');
    const selectedSkillsList = selectedSkills.length > 0 ? selectedSkills.join(',') : null;

    let queryUrl = `/cnames?years=${selectedYearsList}`;
    if (selectedSkills.length > 0) {
        queryUrl += `&skills=${selectedSkillsList}`;
    }

    try {
        const response = await fetch(queryUrl);
        const companies = await response.json();

        // Update the company dropdown
        const companyMenu = document.querySelector('.comp-menu');
        companyMenu.innerHTML = '<div class="item">All Companies</div>';

        companies.forEach(company => {
            const item = document.createElement('div');
            item.className = 'item';
            item.textContent = company.Company_name;
            item.onclick = (e) => itemClickHandler(e);
            companyMenu.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
    }
}

// Call fetchCompanies() when a year is selected
document.getElementById('year-tags-container').addEventListener('click', fetchCompanies);

// Call fetchCompanies() again when a skill is selected
document.getElementById('skill-tags-container').addEventListener('click', fetchCompanies);


function addTag(containerId, itemText, selectedItemsArray, selectedTextId) {
    let tagsContainer = document.getElementById(containerId);

    // Check if the item is already selected
    if (selectedItemsArray.includes(itemText)) {
        return; // Do not add duplicate items
    }

    // Add the item to the tracking array
    selectedItemsArray.push(itemText);

    // Create a new tag
    let tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = itemText;

    // Add a remove button
    let removeBtn = document.createElement('span');
    removeBtn.className = 'remove';
    removeBtn.textContent = 'x';
    removeBtn.onclick = () => {
        tagsContainer.removeChild(tag); // Remove the tag
        selectedItemsArray.splice(selectedItemsArray.indexOf(itemText), 1); // Remove from tracking array

        // If "All" is removed, re-enable all items in the dropdown
        if (itemText.toLowerCase().includes("all")) {
            enableAllDropdownItems(containerId.replace('-tags-container', ''));
        } else {
            enableDropdownItem(itemText, containerId.replace('-tags-container', '')); // Re-enable the specific dropdown item
        }

        // Update the default text if no items are selected
        if (selectedItemsArray.length === 0) {
            document.getElementById(selectedTextId).textContent = `Select ${containerId.replace('-tags-container', '')}`;
        }

        // Enable the skill dropdown if no companies are selected
        if (containerId === 'company-tags-container' && selectedItemsArray.length === 0) {
            enableSkillDropdown();
        }
    };

    tag.appendChild(removeBtn);
    tagsContainer.appendChild(tag);

    // Update the default text
    document.getElementById(selectedTextId).textContent = '';

    // Disable the skill dropdown if a company is selected
    if (containerId === 'company-tags-container') {
        disableSkillDropdown();
    }
}

function disableSkillDropdown() {
    const skillDropdownBtn = document.querySelector('.dropdown-wrapper:nth-child(3) .dropdown-btn');
    const skillDropdownMenu = document.querySelector('.skill-menu');

    skillDropdownBtn.style.pointerEvents = 'none';
    skillDropdownBtn.style.opacity = '0.5';
    skillDropdownMenu.style.pointerEvents = 'none';
}

function enableSkillDropdown() {
    const skillDropdownBtn = document.querySelector('.dropdown-wrapper:nth-child(3) .dropdown-btn');
    const skillDropdownMenu = document.querySelector('.skill-menu');

    skillDropdownBtn.style.pointerEvents = 'auto';
    skillDropdownBtn.style.opacity = '1';
    skillDropdownMenu.style.pointerEvents = 'auto';
}

function disableDropdownItems(selector) {
    let items = document.querySelectorAll(selector);
    items.forEach(item => {
        item.classList.add('disabled');
        item.style.pointerEvents = 'none';
        item.style.opacity = '0.5';
    });
}

function disableDropdownItem(itemText, dropdownType) {
    let dropdownMenu;
    if (dropdownType === 'year') {
        dropdownMenu = document.querySelector('.year-menu');
    } else if (dropdownType === 'company') {
        dropdownMenu = document.querySelector('.comp-menu');
    } else if (dropdownType === 'skill') {
        dropdownMenu = document.querySelector('.skill-menu');
    }

    if (dropdownMenu) {
        let items = dropdownMenu.querySelectorAll('.item');
        items.forEach(item => {
            if (item.innerText === itemText) {
                item.classList.add('disabled');
                item.style.pointerEvents = 'none';
                item.style.opacity = '0.5';
            }
        });
    }
}

function enableDropdownItem(itemText, dropdownType) {
    let dropdownMenu;
    if (dropdownType === 'year') {
        dropdownMenu = document.querySelector('.year-menu');
    } else if (dropdownType === 'company') {
        dropdownMenu = document.querySelector('.comp-menu');
    } else if (dropdownType === 'skill') {
        dropdownMenu = document.querySelector('.skill-menu');
    }

    if (dropdownMenu) {
        let items = dropdownMenu.querySelectorAll('.item');
        items.forEach(item => {
            if (item.innerText === itemText) {
                item.classList.remove('disabled');
                item.style.pointerEvents = 'auto'; // Allow clicks
                item.style.opacity = '1'; // Reset visual indication
            }
        });
    }
}

function enableAllDropdownItems(dropdownType) {
    let dropdownMenu;
    if (dropdownType === 'year') {
        dropdownMenu = document.querySelector('.year-menu');
    } else if (dropdownType === 'company') {
        dropdownMenu = document.querySelector('.comp-menu');
    } else if (dropdownType === 'skill') {
        dropdownMenu = document.querySelector('.skill-menu');
    }

    if (dropdownMenu) {
        let items = dropdownMenu.querySelectorAll('.item');
        items.forEach(item => {
            item.classList.remove('disabled');
            item.style.pointerEvents = 'auto'; // Allow clicks
            item.style.opacity = '1'; // Reset visual indication
        });
    }
}