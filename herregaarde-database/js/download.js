import { downloadPeople } from "./supabase.js";
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

export async function downloadCSV(filters) {
      console.log("Download filters:", filters);
    const { data, error } = await downloadPeople(filters);
      console.log("data:", data);
console.log("error:", error);
    if (error) {
        console.error(error);
        alert("Kunne ikke hente data.");
        return;
    }
    if (!data || data.length === 0) {
        alert("Ingen data at downloade.");
        return;
    }
// CSV-indhold
const rows = [];

//----------------------------------
// Overskrift
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
// Data
//----------------------------------

const headers = Object.keys(data[0]);
rows.push(headers);
data.forEach(row => {
    rows.push(
        headers.map(header => {
            const value = row[header] ?? "";
            return value;
        })
    );
});
// Lav CSV
const csv = rows
    .map(row =>
        row.map(value =>
            `"${String(value).replace(/"/g, '""')}"`
        ).join(";")
    )
    .join("\n");
    // Download fil
    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const today = new Date().toISOString().slice(0,10);
    link.download = `herregaardsdatabase_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
