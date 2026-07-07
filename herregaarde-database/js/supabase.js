const supabaseUrl = "https://tdxlesfxckkwyaqlaxgj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeGxlc2Z4Y2trd3lhcWxheGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODY4MjksImV4cCI6MjA5NjY2MjgyOX0.JXltvUgUoyFlh8P7N0ZIznrkkm90gi7mDdE3P02Gak4";

export const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);
export async function getStatistics() {
    return await supabase.rpc("get_statistics");
}

export async function getPersonCount() {
    const { count, error } = await supabase
        .from("Tjenestefolk")
        .select("*", {
            count: "exact",
            head: true
        });
    return { count, error };
}


export async function getFilters() {
    return await supabase.rpc("get_filters");
}


export async function searchPeople(filters) {
    return await supabase.rpc("search_people", {
        p_herregaard: filters.herregaard || null,
        p_aar: filters.aar || null,
        p_koen: filters.koen || null,
        p_page: filters.page,
        p_page_size: filters.pageSize
    });
}

export async function getPerson(id) {
    const { data, error } = await supabase.rpc(
        "get_person",
        {
            p_id: id
        }
    );
    return { data, error };
}
