import { showDetail } from "./detail.js";
export function createRow(person) {
    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `
        <strong>${person.navn}</strong><br>
        ${person.herregaard}
        ·
        ${person.folketaelling_aar}
        ·
        ${person.alder ?? "-"} år
        ·
        ${person.koen ?? "-"}
        <br>
        ${person.arbejde_titel  ?? ""}
    `;
row.addEventListener("click", () => {
    // Fjern tidligere markering
    document
        .querySelectorAll(".result-row.selected")
        .forEach(r => r.classList.remove("selected"));
    // Marker denne række
    row.classList.add("selected");
    // Vis personen
    showDetail(person.id);
});
    return row;
}
