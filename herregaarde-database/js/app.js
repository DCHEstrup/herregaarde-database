import { getPersonCount } from "./supabase.js";
import { loadFilters } from "./filters.js";
import { performSearch } from "./search.js";
import { renderTable } from "./ui/table.js";

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
        });
});

document
    .getElementById("searchBtn")
    .addEventListener("click", async () => {
        const result = await performSearch();
        if (!result) return;
        renderTable(result);
    });

