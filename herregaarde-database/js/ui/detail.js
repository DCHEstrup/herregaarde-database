import { getPerson } from "../supabase.js";

const fields = [
    ["navn", "Navn"],
    ["herregaard", "Herregård"],
    ["folketaelling_aar", "Folketælling"],
    ["alder", "Alder"],
    ["koen", "Køn"],
    ["arbejde_titel", "Arbejde"],
    ["position_i_husstanden", "Position i husstanden"],
    ["civilstand", "Civilstand"],
    ["foedested", "Fødested"],
    ["trossamfund", "Trossamfund"],
    ["transport", "Transport"],
    ["region", "Region"],
    ["kommune", "Kommune"],
    ["sted", "Sted"],
    ["naermere_lokation", "Nærmere lokation"],
    ["breddegrad_foedested", "Breddegrad"],
    ["laengdegrad_foedested", "Længdegrad"],
    ["handicap", "Handicap"]
];

export async function showDetail(id) {
    const { data, error } = await getPerson(id);
    if (error) {
        console.error(error);
        return;
    }
    const detail = document.getElementById("detail");
    detail.innerHTML = "";
    // Titel
    const title = document.createElement("h2");
    title.textContent = data.navn || "Ukendt person";
    detail.appendChild(title);

    // Tabel
    const table = document.createElement("table");
    table.className = "detail-table";

    for (const [key, label] of fields) {
        if (data[key] === null || data[key] === "") continue;
        const row = document.createElement("tr");
        row.innerHTML = `
            <th>${label}</th>
            <td>${data[key]}</td>
        `;

        table.appendChild(row);
    }
    detail.appendChild(table);
}
export function clearDetail() {
    document
        .querySelectorAll(".result-row.selected")
        .forEach(row => {
            row.classList.remove("selected");
            row.removeAttribute("aria-current");
        });
    const detail =
        document.getElementById("detail");
    if (!detail) return;
    detail.innerHTML = `
        <div class="placeholder">
            Klik på en person for at se alle oplysninger
        </div>
    `;
}
