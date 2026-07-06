const supabaseUrl = "https://tdxlesfxckkwyaqlaxgj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeGxlc2Z4Y2trd3lhcWxheGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODY4MjksImV4cCI6MjA5NjY2MjgyOX0.JXltvUgUoyFlh8P7N0ZIznrkkm90gi7mDdE3P02Gak4";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


export async function getPersonCount() {

    const { count, error } = await supabase
        .from("Tjenestefolk")
        .select("*", {
            count: "exact",
            head: true
        });

    return { count, error };

}


export async function getHerregaarde() {

    const { data, error } = await supabase
        .from("Tjenestefolk")
        .select("Herregård_Clean")
        .not("Herregård_Clean", "is", null);

    if (error) return { data: [], error };

    const values = [...new Set(
        data.map(row => row["Herregård_Clean"])
    )].sort();

    return { data: values, error: null };
}


export async function getFolketaellinger() {

    const { data, error } = await supabase
        .from("Tjenestefolk")
        .select("Folketælling_Clean")
        .not("Folketælling_Clean", "is", null);

    if (error) return { data: [], error };

    const values = [...new Set(
        data.map(row => row["Folketælling_Clean"])
    )].sort((a,b) => a-b);

    return { data: values, error: null };
}


export async function getKoen() {

    const { data, error } = await supabase
        .from("Tjenestefolk")
        .select("Køn_K.M")
        .not("Køn_K.M", "is", null);

    if (error) return { data: [], error };

    const values = [...new Set(
        data.map(row => row["Køn_K.M"])
    )].sort();

    return { data: values, error: null };
}
