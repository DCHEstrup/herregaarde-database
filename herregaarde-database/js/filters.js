import { getFilters } from "./supabase.js";
import { createMultiSelect } from "./ui/multiselectV2.js";

export async function loadFilters() {

    const { data, error } = await getFilters();

    if (error) {
        console.error(error);
        return;
    }

    //----------------------------------
    // Herregårde
    //----------------------------------

    createMultiSelect({
        containerId: "herregaard",
        values: data.herregaarde,
        placeholder: "Alle herregårde"
    });

    //----------------------------------
    // Folketællinger
    //----------------------------------

    createMultiSelect({
        containerId: "aar",
        values: data.folketaellinger,
        placeholder: "Alle år"
    });
}

// Hjælpefunktion
function fillSelect(id, values, firstText) {
    const select = document.getElementById(id);
    if (!select) return;
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
