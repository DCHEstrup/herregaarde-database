import { searchPeople } from "./supabase.js";
import { getCurrentFilters } from "./filtersState.js";

export async function performSearch(page = 1) {
    const filters = {
        ...getCurrentFilters(),
        page,
        pageSize: 8
    };


    console.log(filters);
    const { data, error } = await searchPeople(filters);
    if (error) {
        console.error(error);
        return;
    }
    return data;
}
