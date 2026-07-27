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
import { loadStatistics } from "./statistics.js";
import { downloadStatistics } from "./downloadStatistics.js";
import { clearDetail } from "./ui/detail.js";
import { initSelectedFilters } from "./ui/selectedFilters.js";

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

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        await loadFilters();
        initialiseAdvancedFilters();
        initSelectedFilters();
        
async function loadPage(page = 1) {
    const searchButton =
        document.getElementById("searchBtn");
    const originalText =
        searchButton?.textContent ?? "Søg";
    try {
        if (searchButton) {
            searchButton.disabled = true;
            searchButton.textContent = "Søger …";
            searchButton.setAttribute(
                "aria-busy",
                "true"
            );
        }
        clearDetail();
        const result =
            await performSearch(page);
        if (!result) {
            return;
        }
        renderTable(result);
        renderPagination(
            result,
            loadPage
        );

        await loadStatistics();
    }
    catch (error) {
        console.error(
            "Fejl under søgning:",
            error
        );
    }
    finally {
        if (searchButton) {
            searchButton.disabled = false;
            searchButton.textContent =
                originalText;
            searchButton.removeAttribute(
                "aria-busy"
            );
        }
    }
}

        document
            .getElementById("searchBtn")
            ?.addEventListener(
                "click",
                () => loadPage(1)
            );

        document
            .getElementById("downloadBtn")
            ?.addEventListener(
                "click",
                () => {
                    downloadCSV(
                        getCurrentFilters()
                    );
                }
            );

        document
            .getElementById("clearBtn")
            ?.addEventListener(
                "click",
                () => {
                    clearFilters();
                }
            );

        document
            .getElementById(
                "downloadStatisticsBtn"
            )
            ?.addEventListener(
                "click",
                () => {
                    downloadStatistics(
                        getCurrentFilters()
                    );
                }
            );
    }
);
