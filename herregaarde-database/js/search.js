import { searchPeople } from "./supabase.js";

export async function performSearch(page = 1) {
    const filters = {
        herregaard:
            document.getElementById("herregaard").value || null,
        aar:
            document.getElementById("aar").value || null,
        koen:
            document.getElementById("koen").value || null,
        page,
        pageSize: 8
    };
    const { data, error } = await searchPeople(filters);
    if (error) {
        console.error(error);
        return;
    }
    return data;
}
