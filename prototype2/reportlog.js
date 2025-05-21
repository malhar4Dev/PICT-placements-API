// function updateReportLog(year, company, lpa) {
//     const reportLogContainer = document.querySelector('.report-log');

//     // Create a new log entry
//     const logEntry = document.createElement('div');
//     logEntry.classList.add('log-entry');
//     logEntry.textContent = `📅 ${year} | 🏢 ${company} | 💰 ${lpa} LPA`;

//     // Append to report log
//     reportLogContainer.appendChild(logEntry);

//     // Ensure it stays scrollable
//     reportLogContainer.scrollTop = reportLogContainer.scrollHeight;
// }

// reportlog.js - FIXED: Ensure logs are stored in sessionStorage
function updateReportLog(year, company, lpa) {
    const logKey = "analysisLog";
    let logs = JSON.parse(sessionStorage.getItem(logKey)) || [];

    // Prevent duplicate entries
    if (!logs.some(log => log.year === year && log.company === company)) {
        logs.push({ year, company, lpa });
        sessionStorage.setItem(logKey, JSON.stringify(logs));
    }
    
    renderReportLog();
}

// Function to render logs from sessionStorage
function renderReportLog() {
    const reportLogContainer = document.querySelector('.report-log');
    reportLogContainer.innerHTML = ""; // Clear existing logs

    let logs = JSON.parse(sessionStorage.getItem("analysisLog")) || [];
    logs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry');
        logEntry.textContent = `📅 ${log.year} | 🏢 ${log.company} | 💰 ${log.lpa} LPA`;
        reportLogContainer.appendChild(logEntry);
    });
    
    // Keep scroll position updated
    reportLogContainer.scrollTop = reportLogContainer.scrollHeight;
}

// Ensure logs are displayed on page load
document.addEventListener("DOMContentLoaded", renderReportLog);
