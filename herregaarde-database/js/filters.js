import { getFilters } from "./supabase.js";


export async function loadFilters() {

    const { data, error } = await getFilters();

    if (error) {
        console.error(error);
        return;
    }

    fillSelect(
        "herregaard",
        data.herregaarde,
        "Alle herregårde"
    );

    fillSelect(
        "aar",
        data.aar,
        "Alle år"
    );

    fillSelect(
        "koen",
        data.koen,
        "Alle"
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
