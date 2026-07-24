import { getSearchStatistics } from "./supabase.js";

const labels = {
    aar: "Folketælling",
    koen: "Køn",
    civilstand: "Civilstand",
    trossamfund: "Religion",
    alder: "Aldersfordeling"
};
const filterLabels = {
    herregaard: "Herregård",
    aar: "Folketællingsår",
    koen: "Køn",
    trossamfund: "Religion",
    civilstand: "Civilstand",
    region: "Region",
    kommune: "Kommune",
    handicap: "Handicap",
    arbejde: "Fritekstsøgning",
    arbejdeValgt: "Arbejde / Position"
};

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
const blob = new Blob(
    [csv],
    {
        type: "text/csv;charset=utf-8;"
    }
);
const url =
    URL.createObjectURL(blob);
const link =
    document.createElement("a");
link.href = url;
const today =
    new Date()
        .toISOString()
        .slice(0,10);
link.download =
    `Herregaardsdatabasen_Statistik_${today}.csv`;
document.body.appendChild(link);
link.click();
link.remove();
URL.revokeObjectURL(url);
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
            filterLabels[key] || key,
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
    if (
        category === "total" ||
        !values ||
        values.length === 0
    ) {
        return;
    }
    rows.push([labels[category] || category]);
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
