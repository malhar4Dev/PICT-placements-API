function updateReportLog(year, company, lpa) {
    const reportLogContainer = document.querySelector('.report-log');

    // Create a new log entry
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');
    logEntry.textContent = `📅 ${year} | 🏢 ${company} | 💰 ${lpa} LPA`;

    // Append to report log
    reportLogContainer.appendChild(logEntry);

    // Ensure it stays scrollable
    reportLogContainer.scrollTop = reportLogContainer.scrollHeight;
}
