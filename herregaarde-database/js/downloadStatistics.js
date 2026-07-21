import { getSearchStatistics } from "./supabase.js";

export async function downloadStatistics(filters) {
    const { data, error } =
        await getSearchStatistics(filters);
    if (error) {
        console.error(error);
        return;
    }
    const csv = buildStatisticsCSV(
    data,
    filters
);
console.log(csv);
}

function buildStatisticsCSV(statistics, filters) {
    const rows = [];

    //----------------------------------
    // Overskrift
    //----------------------------------

    rows.push(["Herregårdsdatabasen"]);
    rows.push(["Statistik over søgeresultat"]);
    rows.push([]);

    //----------------------------------
    // Filtre
    //----------------------------------

    rows.push(["Anvendte filtre"]);
    Object.entries(filters).forEach(([key, value]) => {
        if (
            value == null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
        ) {
            return;
        }
        rows.push([
            key,
            Array.isArray(value)
                ? value.join(", ")
                : value
        ]);
    });
    rows.push([]);

    //----------------------------------
    // Antal personer
    //----------------------------------

    rows.push([
        "Antal personer",
        statistics.total
    ]);
    rows.push([]);

    //----------------------------------
    // Statistik
    //----------------------------------

    Object.entries(statistics).forEach(([category, values]) => {
        if (category === "total")
            return;
        rows.push([category]);
        rows.push([
            "Værdi",
            "Antal",
            "Procent"
        ]);
        const total =
            values.reduce(
                (sum, row) => sum + row.count,
                0
            );
        values.forEach(row => {
            rows.push([
                row.label,
                row.count,
                (
                    row.count /
                    total *
                    100
                ).toFixed(1) + "%"
            ]);
        });
        rows.push([]);
    });
    return rows
        .map(r => r.join(";"))
        .join("\n");
}
