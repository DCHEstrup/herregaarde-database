import { showDetail } from "./detail.js";

export function createRow(person) {
    const row = document.createElement("div");

    row.dataset.id = person.id;
    row.className = "result-row";
    row.tabIndex = 0;
    row.setAttribute("role", "button");

    const cells = [
        {
            label: "Navn",
            value: person.navn || "Ukendt",
            className: "result-name"
        },
        {
            label: "Herregård",
            value: person.herregaard || "-"
        },
        {
            label: "Folketælling",
            value: person.folketaelling_aar || "-"
        },
        {
            label: "Alder og køn",
            value: formatAgeAndGender(person)
        },
        {
            label: "Arbejde",
            value: person.arbejde_titel || "-"
        }
    ];

    cells.forEach(({ label, value, className = "" }) => {
        const cell = document.createElement("div");
        cell.className = "result-cell";

        const heading = document.createElement("strong");
        heading.textContent = label;

        const content = document.createElement("span");
        content.textContent = value;

        if (className) {
            content.classList.add(className);
        }

        cell.append(heading, content);
        row.appendChild(cell);
    });

    const selectRow = () => {
        document
            .querySelectorAll(".result-row.selected")
            .forEach(resultRow => {
                resultRow.classList.remove("selected");
                resultRow.removeAttribute("aria-current");
            });

        row.classList.add("selected");
        row.setAttribute("aria-current", "true");

        showDetail(person.id);
    };

    row.addEventListener("click", selectRow);

    row.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectRow();
        }
    });

    return row;
}

function formatAgeAndGender(person) {
    const age = person.alder
        ? `${person.alder} år`
        : "-";

    const gender = person.koen || "-";

    return `${age} · ${gender}`;
}
