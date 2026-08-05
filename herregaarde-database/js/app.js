import { loadFilters } from "./filters.js";
import { performSearch } from "./search.js";
import { renderTable } from "./ui/table.js";
import { downloadCSV } from "./download.js";
import { getCurrentFilters } from "./filtersState.js";
import { renderPagination } from "./ui/pagination.js";
import { clearFilters } from "./clearFilters.js";
import { initialiseAdvancedFilters } from "./advancedFilters.js";
import { loadStatistics } from "./statistics.js";
import { downloadStatistics } from "./downloadStatistics.js";
import { clearDetail } from "./ui/detail.js";
import { initSelectedFilters } from "./ui/selectedFilters.js";
import { initialiseFilterInfo } from "./filterInfo.js";
import { downloadExcel } from "./downloadExcel.js";
import { initDatabaseTabs } from "./ui/databaseTabs.js";
import { loadEstateComparison } from "./estateComparison.js";

document.addEventListener(
    "DOMContentLoaded",
    async () => {
        //----------------------------------
        // Initialisering
        //----------------------------------

        await loadFilters();

        initialiseAdvancedFilters();
        initSelectedFilters();
        initialiseFilterInfo();
        initDatabaseTabs({
            onOpenComparison:loadEstateComparison});

        //----------------------------------
        // Hent og vis en side
        //----------------------------------

        async function loadPage(
            page = 1,
            showLoadingOnButton = false
        ) {
            const searchButton =
                document.getElementById(
                    "searchBtn"
                );
            const originalText =
                searchButton?.textContent
                    ?.trim() || "Søg";
            try {
                if (
                    showLoadingOnButton &&
                    searchButton
                ) {
                    searchButton.disabled = true;
                    searchButton.textContent =
                        "Søger …";
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
                    pageNumber => {
                        loadPage(
                            pageNumber,
                            false
                        );
                    }
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
                if (
                    showLoadingOnButton &&
                    searchButton
                ) {
                    searchButton.disabled =
                        false;
                    searchButton.textContent =
                        originalText;
                    searchButton.removeAttribute(
                        "aria-busy"
                    );
                }
            }
        }
        //----------------------------------
        // Global søgning
        //----------------------------------
        const globalSearch =
            document.getElementById(
                "globalSearch"
            );
        const clearGlobalSearch =
            document.getElementById(
                "clearGlobalSearch"
            );
        globalSearch?.addEventListener(
            "keydown",
            event => {
                if (event.key !== "Enter") {
                    return;
                }
                event.preventDefault();
                loadPage(1, true);
            }
        );
        globalSearch?.addEventListener(
            "input",
            () => {
                if (clearGlobalSearch) {
                    clearGlobalSearch.hidden =
                        !globalSearch.value.trim();
                }
                document.dispatchEvent(
                    new CustomEvent(
                        "filtersChanged"
                    )
                );
            }
        );
        clearGlobalSearch?.addEventListener(
            "click",
            () => {
                if (!globalSearch) {
                    return;
                }
                globalSearch.value = "";
                clearGlobalSearch.hidden = true;
                globalSearch.focus();
                document.dispatchEvent(
                    new CustomEvent(
                        "filtersChanged"
                    )
                );
            }
        );
        //----------------------------------
        // Søg
        //----------------------------------
        document
            .getElementById("searchBtn")
            ?.addEventListener(
                "click",
                () => {
                    loadPage(1, true);
                }
            );
        //----------------------------------
        // Sortering
        //----------------------------------
        document
            .getElementById("sortSelect")
            ?.addEventListener(
                "change",
                () => {
                    loadPage(1, false);
                }
            );
        //----------------------------------
        // Download data
        //----------------------------------
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
        //----------------------------------
        // Download statistik
        //----------------------------------
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
        //----------------------------------
        // Download Excel
        //----------------------------------
        document
    .getElementById(
        "downloadExcelBtn"
    )
    ?.addEventListener(
        "click",
        () => {
            downloadExcel(
                getCurrentFilters()
            );
        }
    );
        //----------------------------------
        // Ryd filtre
        //----------------------------------
        document
            .getElementById("clearBtn")
            ?.addEventListener(
                "click",
                () => {
                    clearFilters();
                }
            );
    }
);
