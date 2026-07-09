import { searchPeople } from "./supabase.js";
import {getSelectedValues} from "./ui/multiselectV2.js";

export async function performSearch(page = 1) {
const filters = {
    herregaard:
        getSelectedValues("herregaard"),
    aar:
        getSelectedValues("aar"),
    arbejde:
        document
            .getElementById("arbejde")
            .value
            || null,
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
