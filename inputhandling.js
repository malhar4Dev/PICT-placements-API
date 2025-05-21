const skills = [
    "DSA",
    "Development",
    "Aptitude",
    "Machine Learning",
    "Cloud Computing",
    "AI",
    "Cybersecurity",
    "Blockchain",
    "DevOps",
    "Data Science"
];

const years = [
    "2019 -20",
    "2020 -21",
    "2021 -22",
    "2022 -23",
    "2023 -24",
    "2024 -25"
];

const companies = [
    "Amazon",
    "Google",
    "Microsoft",
    "Apple",
    "Facebook",
    "Netflix",
    "Tesla",
    "Oracle",
    "IBM",
    "Intel"
];

function showSkillSuggestions(value) {
    const skillsSuggestions = document.getElementById('skillsSuggestions');
    skillsSuggestions.innerHTML = ''; // Clear previous suggestions
    if (!value) {
        skillsSuggestions.style.display = 'none';
        return;
    }

    const filteredSkills = skills.filter(skill => skill.toLowerCase().includes(value.toLowerCase()));
    if (filteredSkills.length === 0) {
        skillsSuggestions.style.display = 'none';
        return;
    }

    filteredSkills.forEach(skill => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = skill;
        suggestionItem.onclick = () => selectSkill(skill);
        skillsSuggestions.appendChild(suggestionItem);
    });

    skillsSuggestions.style.display = 'block';
}

function showYearSuggestions(value) {
    const yearSuggestions = document.getElementById('yearSuggestions');
    yearSuggestions.innerHTML = ''; // Clear previous suggestions
    if (!value) {
        yearSuggestions.style.display = 'none';
        return;
    }

    const filteredYears = years.filter(year => year.toLowerCase().includes(value.toLowerCase()));
    if (filteredYears.length === 0) {
        yearSuggestions.style.display = 'none';
        return;
    }

    filteredYears.forEach(year => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = year;
        suggestionItem.onclick = () => selectYear(year);
        yearSuggestions.appendChild(suggestionItem);
    });

    yearSuggestions.style.display = 'block';
}

function showCompanySuggestions(value) {
    const companySuggestions = document.getElementById('companySuggestions');
    companySuggestions.innerHTML = ''; // Clear previous suggestions
    if (!value) {
        companySuggestions.style.display = 'none';
        return;
    }

    const filteredCompanies = companies.filter(company => company.toLowerCase().includes(value.toLowerCase()));
    if (filteredCompanies.length === 0) {
        companySuggestions.style.display = 'none';
        return;
    }

    filteredCompanies.forEach(company => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = company;
        suggestionItem.onclick = () => selectCompany(company);
        companySuggestions.appendChild(suggestionItem);
    });

    companySuggestions.style.display = 'block';
}

function selectSkill(skill) {
    const tagsContainer = document.getElementById('skillsTagsContainer');
    const existingTags = Array.from(tagsContainer.getElementsByClassName('tag')).map(tag => tag.textContent.trim());

    if (!existingTags.includes(skill)) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = skill;

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove';
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => {
            tagsContainer.removeChild(tag);
            if (tagsContainer.children.length === 0) {
                document.getElementById('skillsInput').value = '';
            }
        };

        tag.appendChild(removeBtn);
        tagsContainer.insertBefore(tag, document.getElementById('skillsInput'));
        document.getElementById('skillsInput').value = ''; // Clear input
        document.getElementById('skillsSuggestions').style.display = 'none'; // Hide suggestions
    }
}

function selectYear(year) {
    const tagsContainer = document.getElementById('yearTagsContainer');
    const existingTags = Array.from(tagsContainer.getElementsByClassName('tag')).map(tag => tag.textContent.trim());

    if (!existingTags.includes(year)) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = year;

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove';
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => {
            tagsContainer.removeChild(tag);
            if (tagsContainer.children.length === 0) {
                document.getElementById('yearInput').value = '';
            }
        };

        tag.appendChild(removeBtn);
        tagsContainer.insertBefore(tag, document.getElementById('yearInput'));
        document.getElementById('yearInput').value = ''; // Clear input
        document.getElementById('yearSuggestions').style.display = 'none'; // Hide suggestions
    }
}

function selectCompany(company) {
    const tagsContainer = document.getElementById('companyTagsContainer');
    const existingTags = Array.from(tagsContainer.getElementsByClassName('tag')).map(tag => tag.textContent.trim());

    if (!existingTags.includes(company)) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = company;

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove';
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => {
            tagsContainer.removeChild(tag);
            if (tagsContainer.children.length === 0) {
                document.getElementById('companyInput').value = '';
            }
        };

        tag.appendChild(removeBtn);
        tagsContainer.insertBefore(tag, document.getElementById('companyInput'));
        document.getElementById('companyInput').value = ''; // Clear input
        document.getElementById('companySuggestions').style.display = 'none'; // Hide suggestions
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', (event) => {
    const skillsSuggestions = document.getElementById('skillsSuggestions');
    const yearSuggestions = document.getElementById('yearSuggestions');
    const companySuggestions = document.getElementById('companySuggestions');

    if (!event.target.closest('.tags') && !event.target.closest('.suggestions')) {
        skillsSuggestions.style.display = 'none';
        yearSuggestions.style.display = 'none';
        companySuggestions.style.display = 'none';
    }
});