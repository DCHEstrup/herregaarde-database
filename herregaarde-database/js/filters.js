import { getFilters } from "./supabase.js";


export async function loadFilters() {

    const { data, error } = await getFilters();

    if (error) {
        console.error(error);
        return;
    }
const filters = [
    {
        id: "herregaard",
        values: data.herregaarde,
        placeholder: "Alle herregårde"
    },
    {
        id: "aar",
        values: data.folketaellinger,
        placeholder: "Alle år"
    },
    {
        id: "koen",
        values: data.koen,
        placeholder: "Alle"
    }
];

filters.forEach(filter =>
    fillSelect(filter.id, filter.values, filter.placeholder)
);

}

// Hjælpefunktion
function fillSelect(id, values, firstText) {
    const select = document.getElementById(id);
    select.innerHTML = "";
    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = firstText;
    select.appendChild(firstOption);
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}
