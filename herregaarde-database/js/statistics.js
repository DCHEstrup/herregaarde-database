export async function loadStatistics() {

    const filters = getCurrentFilters();

    const { data } =
        await getSearchStatistics(filters);

    renderStatistics(data);

}
