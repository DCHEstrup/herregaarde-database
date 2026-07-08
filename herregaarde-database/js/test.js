import { getJobSuggestions } from "./supabase.js";

const { data, error } =
    await getJobSuggestions("pige");

console.log(data);
console.log(error);
