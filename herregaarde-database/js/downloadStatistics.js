import { getSearchStatistics } from "./supabase.js";

export async function downloadStatistics(filters) {
    const { data, error } =
        await getSearchStatistics(filters);
    if (error) {
        console.error(error);
        return;
    }
    console.log(data);
}
