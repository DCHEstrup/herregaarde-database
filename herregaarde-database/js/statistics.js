import { getCurrentFilters } from "./filtersState.js";
import { getSearchStatistics } from "./supabase.js";
import { renderStatistics } from "./ui/statisticsPanel.js";

export async function loadStatistics() {
    const filters = getCurrentFilters();
    const { data, error } =
        await getSearchStatistics(filters);
    if (error) {
        console.error(error);
        return;
    }
    renderStatistics(data);
}
