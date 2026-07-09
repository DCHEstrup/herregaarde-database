import { getStatistics  } from "./supabase.js";
import { loadFilters } from "./filters.js";
import { performSearch } from "./search.js";
import { renderTable } from "./ui/table.js";
import { downloadCSV } from "./download.js";
import { getCurrentFilters } from "./filtersState.js";
import { renderPagination } from "./ui/pagination.js";
import { enableAutosuggest } from "./autosuggest.js";
import { getJobSuggestions } from "./supabase.js";
import { createMultiSelect } from "./ui/multiselect.js";

await loadFilters();
createMultiSelect({
    containerId: "herregaard",
    placeholder: "Alle herregårde",
    values: [
        "Gammel Estrup",
        "Frijsenborg",
        "Rosenholm",
        "Clausholm",
        "Løvenholm",
        "Sostrup",
        "Krenkerup",
        "Skjern"
    ]
});

createMultiSelect({
    containerId: "aar",
    placeholder: "Alle år",
    values: [
        1787,
        1801,
        1834,
        1840,
        1845,
        1850,
        1860
    ]
});
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
      enableAutosuggest(
        "arbejde",
        getJobSuggestions
    );
    async function loadPage(page = 1) {
        const result = await performSearch(page);
        if (!result) return;
        renderTable(result);
        renderPagination(result, loadPage);
    }
    document
        .getElementById("searchBtn")
        .addEventListener("click", () => loadPage(1));
});

document
    .getElementById("downloadBtn")
    .addEventListener("click", () => {
        downloadCSV(getCurrentFilters());
    });

