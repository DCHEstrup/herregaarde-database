import { getPersonCount } from "./supabase.js";
import { loadFilters } from "./filters.js";
document.addEventListener("DOMContentLoaded", async () => {

    const { count } = await getPersonCount();

    console.log(count);

});

document.addEventListener("DOMContentLoaded", async () => {

    await loadFilters();

});
