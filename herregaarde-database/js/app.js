import { getStatistics  } from "./supabase.js";
import { loadFilters } from "./filters.js";
import { performSearch } from "./search.js";
import { renderTable } from "./ui/table.js";
import { downloadCSV } from "./download.js";
import { getCurrentFilters } from "./filtersState.js";

document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await getStatistics();
document.getElementById("personCount").textContent =
    data.persons.toLocaleString("da-DK");
document.getElementById("estateCount").textContent =
    data.estates.toLocaleString("da-DK");
document.getElementById("censusCount").textContent =
    data.censusYears;
});

document.addEventListener("DOMContentLoaded", async () => {
    await loadFilters();
    document
        .getElementById("searchBtn")
        .addEventListener("click", async () => {
            const result = await performSearch();
            renderTable(result);
            renderPagination(result, async (page) => {

    const result = await performSearch(page);

    renderTable(result);

    renderPagination(result, arguments.callee);

});
            
        });
});

document
    .getElementById("downloadBtn")
    .addEventListener("click", () => {
        downloadCSV(getCurrentFilters());
    });

