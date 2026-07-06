import {
    getHerregaarde,
    getFolketaellinger,
    getKoen
} from "./supabase.js";


export async function loadFilters() {

    const herregaarde = await getHerregaarde();
    const aar = await getFolketaellinger();
    const koen = await getKoen();

    fillSelect(
        "herregaard",
        herregaarde.data,
        "Alle herregårde"
    );

    fillSelect(
        "aar",
        aar.data,
        "Alle år"
    );
    fillSelect(
        "koen",
        koen.data,
        "Alle"
    );
    console.log("loadFilters kører");
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
