import { createRow } from "./row.js";

export function renderTable(result) {
    const container = document.getElementById("results");
    const resultCount = document.getElementById("resultCount");
    const downloadBtn = document.getElementById("downloadBtn");
    const downloadStatisticsBtn = document.getElementById("downloadStatisticsBtn");
    // Opdater antal fundne personer
    resultCount.textContent =
        `${result.total.toLocaleString("da-DK")} personer fundet`;
    // Aktivér download-knappen
    downloadBtn.disabled = result.total === 0;
    downloadStatisticsBtn.disabled = result.total === 0;
    // Fjern tidligere resultater
    container.innerHTML = "";
    // Ingen resultater
    if (result.data.length === 0) {
        container.innerHTML = `
            <div class="placeholder">
                Ingen personer matcher søgningen.
            </div>
        `;
        return;
    }
    // Opret én række pr. person
    result.data.forEach(person => {
        const row = createRow(person);
        container.appendChild(row);
    });
}
