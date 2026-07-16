import { downloadPeople } from "./supabase.js";

export async function downloadCSV(filters) {
      console.log("Download filters:", filters);
    const { data, error } = await downloadPeople(filters);
      console.log(data);
console.log(error);
    if (error) {
        console.error(error);
        alert("Kunne ikke hente data.");
        return;
    }
    if (!data || data.length === 0) {
        alert("Ingen data at downloade.");
        return;
    }
    // Kolonnenavne
    const headers = Object.keys(data[0]);
    // CSV-indhold
    const csv = [
        headers.join(";"),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header] ?? "";
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(";")
        )
    ].join("\n");
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
