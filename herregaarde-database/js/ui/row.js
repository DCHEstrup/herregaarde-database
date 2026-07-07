import { showDetail } from "./detail.js";
export function createRow(person) {
    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `
        <strong>${person.navn}</strong><br>
        ${person.herregaard}
        ·
        ${person.aar}
        ·
        ${person.alder ?? "-"} år
        ·
        ${person.koen ?? "-"}
        <br>
        ${person.arbejde ?? ""}
    `;
    row.addEventListener("click", () => {
        showDetail(person.id);
    });
    return row;
}
