import { getPersonCount } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {

    const { count } = await getPersonCount();

    console.log(count);

});
