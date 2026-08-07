import { getFilters } from "./supabase.js";
import { createMultiSelect } from "./ui/multiselectV2.js";
import { createArbejdeAutocomplete } from "./ui/arbejdeAutocomplete.js";


export async function loadFilters() {

    const { data, error } =
        await getFilters();

    if (error) {
        console.error(error);
        return;
    }

    //----------------------------------
    // Herregårde
    //----------------------------------

    const estateData =
        Array.isArray(data.herregaarde)
            ? data.herregaarde
            : [];

    //----------------------------------
    // Almindelig liste med navne
    //----------------------------------

    const estateValues =
        estateData
            .map(item => {
                if (
                    item !== null &&
                    typeof item === "object"
                ) {
                    return (
                        item.value ??
                        item.label
                    );
                }

                return item;
            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    String(a).localeCompare(
                        String(b),
                        "da"
                    )
            );

    //----------------------------------
    // Gruppér efter region
    //----------------------------------

    const estateGroups = {};

    estateData.forEach(item => {

        /*
         * Hvis get_filters stadig kun
         * returnerer strings, findes der
         * ingen region at gruppere på.
         */
        if (
            item === null ||
            typeof item !== "object"
        ) {
            return;
        }

        const estate =
            item.value ??
            item.label;

        const region =
            item.region ||
            "Region ikke angivet";

        if (!estate) {
            return;
        }

        if (!estateGroups[region]) {
            estateGroups[region] = [];
        }

        estateGroups[region].push(
            estate
        );
    });
    console.log(
    "estateGroups:",
    estateGroups
);

    //----------------------------------
    // Sortér herregårde inden for region
    //----------------------------------

    Object.values(
        estateGroups
    ).forEach(estates => {

        estates.sort(
            (a, b) =>
                String(a).localeCompare(
                    String(b),
                    "da"
                )
        );

    });

    //----------------------------------
    // Opret herregårds-multiselect
    //----------------------------------

    createMultiSelect({
        containerId:
            "herregaard",

        values:
            estateValues,

        groups:
            Object.keys(
                estateGroups
            ).length
                ? estateGroups
                : null,

        placeholder:
            "Alle herregårde"
    });


    //----------------------------------
    // Folketællinger
    //----------------------------------

    createMultiSelect({
        containerId: "aar",
        values: data.folketaellinger,
        placeholder: "Alle år"
    });


    //----------------------------------
    // Køn
    //----------------------------------

    createMultiSelect({
        containerId: "koen",
        values: data.koen,
        placeholder: "Alle køn"
    });


    //----------------------------------
    // Trossamfund
    //----------------------------------

    createMultiSelect({
        containerId: "trossamfund",
        values: data.trossamfund,
        placeholder: "Alle religioner"
    });


    //----------------------------------
    // Civilstand
    //----------------------------------

    createMultiSelect({
        containerId: "civilstand",
        values: data.civilstand,
        placeholder: "Alle civilstande"
    });


    //----------------------------------
    // Region
    //----------------------------------

    createMultiSelect({
        containerId: "region",
        values: data.region,
        placeholder: "Alle regioner"
    });


    //----------------------------------
    // Kommune
    //----------------------------------

    createMultiSelect({
        containerId: "kommune",
        values: data.kommune,
        placeholder: "Alle kommuner"
    });


    //----------------------------------
    // Handicap
    //----------------------------------

    createMultiSelect({
        containerId: "handicap",
        values: data.handicap,
        placeholder: "Alle handicap"
    });


    //----------------------------------
    // Arbejde / position
    //----------------------------------

    createArbejdeAutocomplete({
        inputId: "arbejde",
        suggestionId:
            "arbejdeSuggestions",
        data: data.arbejde
    });
}


//----------------------------------
// Hjælpefunktion
//----------------------------------

function fillSelect(
    id,
    values,
    firstText
) {

    const select =
        document.getElementById(id);

    if (!select) {
        return;
    }

    select.innerHTML = "";

    const firstOption =
        document.createElement(
            "option"
        );

    firstOption.value = "";
    firstOption.textContent =
        firstText;

    select.appendChild(
        firstOption
    );

    values.forEach(value => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            value;

        option.textContent =
            value;

        select.appendChild(
            option
        );
    });
}
