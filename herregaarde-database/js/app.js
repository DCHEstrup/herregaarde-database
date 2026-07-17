import { loadFilters } from "./filters.js";
import { performSearch } from "./search.js";
import { renderTable } from "./ui/table.js";
import { downloadCSV } from "./download.js";
import { getCurrentFilters } from "./filtersState.js";
import { renderPagination } from "./ui/pagination.js";
import { enableAutosuggest } from "./autosuggest.js";
import { getJobSuggestions, getStatistics } from "./supabase.js";
import { createMultiSelect } from "./ui/multiselectV2.js";
import { clearFilters } from "./clearFilters.js";
import { initialiseAdvancedFilters } from "./advancedFilters.js";


/*
document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await getStatistics();
document.getElementById("personCount").textContent =
    data.persons.toLocaleString("da-DK");
document.getElementById("estateCount").textContent =
    data.estates.toLocaleString("da-DK");
document.getElementById("censusCount").textContent =
    data.censusYears;
});
*/

document.addEventListener("DOMContentLoaded", async () => {

    await loadFilters();
    /*
      enableAutosuggest(
        "arbejde",
        getJobSuggestions
    );
*/
    async function loadPage(page = 1) {
        const result = await performSearch(page);
        if (!result) return;
        renderTable(result);
        renderPagination(result, loadPage);
    }
    document
        .getElementById("searchBtn")
        .addEventListener("click", () => loadPage(1));
    initialiseAdvancedFilters();
});

document
    .getElementById("downloadBtn")
    .addEventListener("click", () => {
        downloadCSV(getCurrentFilters());
    });
document
    .getElementById("clearBtn")
    .addEventListener("click", () => {
        clearFilters();
    });
