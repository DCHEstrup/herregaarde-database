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
        console.log(person.id);
        // Senere:
        // showDetail(person.id);
    });
    return row;
}
