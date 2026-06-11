console.log("app.js loaded");
const supabaseUrl = "https://tdxlesfxckkwyaqlaxgj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeGxlc2Z4Y2trd3lhcWxheGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODY4MjksImV4cCI6MjA5NjY2MjgyOX0.JXltvUgUoyFlh8P7N0ZIznrkkm90gi7mDdE3P02Gak4";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document
    .getElementById("test")
    .addEventListener("click", hentData);

async function hentData() {

    const { data, error } = await db
        .from("Tjenestefolk")
        .select("*")
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("output").textContent =
        JSON.stringify(data, null, 2);
}
