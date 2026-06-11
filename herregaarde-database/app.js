const supabaseUrl = "DIN_PROJECT_URL";
const supabaseKey = "DIN_PUBLISHABLE_KEY";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document
    .getElementById("test")
    .addEventListener("click", hentData);

async function hentData() {

    const { data, error } = await supabase
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