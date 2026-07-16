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

export async function getJobSuggestions(query) {
    return await supabase.rpc("get_job_suggestions", {
        p_query: query
    });
}

export async function searchPeople(filters) {

    return await supabase.rpc("search_people", {

        p_herregaard:
            filters.herregaard?.length
                ? filters.herregaard
                : null,
        p_aar:
            filters.aar?.length
                ? filters.aar.map(Number)
                : null,
        p_koen:
            filters.koen?.length
                ? filters.koen
                : null,
        p_trossamfund:
            filters.trossamfund?.length
                ? filters.trossamfund
                : null,
        p_region:
            filters.region?.length
            ? filters.region
            : null,

        p_kommune:
            filters.kommune?.length
            ? filters.kommune
            : null,
        p_handicap:
            filters.handicap?.length
            ? filters.handicap
            : null,
        p_arbejde:
            filters.arbejde || null,
        p_civilstand:
            filters.civilstand?.length
                ? filters.civilstand
                : null,
        p_page:
            filters.page,
        p_page_size:
            filters.pageSize
    });
}
export async function getPerson(id) {
    return await supabase.rpc("get_person", {
        p_id: id
    });
}



export async function downloadPeople(filters = {}) {

    return await supabase.rpc("download_people", {
        p_herregaard: filters.herregaard?.length
                ? filters.herregaard
                : null,
        p_aar:  filters.aar?.length
                ? filters.aar.map(Number)
                : null,
        p_trossamfund: filters.trossamfund?.length
        ? filters.trossamfund
        : null,
        p_koen: filters.koen?.length
        ? filters.koen
        : null,
        p_region:
            filters.region?.length
            ? filters.region
            : null,

        p_kommune:
            filters.kommune?.length
            ? filters.kommune
            : null,
        p_arbejde: filters.arbejde || null,
        p_civilstand:
            filters.civilstand || null
    });

}
