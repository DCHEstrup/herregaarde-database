import { clearMultiSelect } from "./ui/multiselectV2.js";
import { clearResults } from "./ui/results.js";

export function clearFilters() {

    //----------------------------------
    // Multiselects
    //----------------------------------

    clearMultiSelect("herregaard");
    clearMultiSelect("aar");
    clearMultiSelect("koen");
    clearMultiSelect("trossamfund");
    clearMultiSelect("civilstand");
    clearMultiSelect("region");
    clearMultiSelect("kommune");
    clearMultiSelect("handicap");
    clearMultiSelect("alderFra");
    clearMultiSelect("alderTil");

    //----------------------------------
    // Arbejde / Position
    //----------------------------------

    [
    "arbejde",
    "alderFra",
    "alderTil",
    "transportFra",
    "transportTil"
].forEach(id => {

    const element =
        document.getElementById(id);

    if (element) {
        element.value = "";
    }

});

    //----------------------------------
    // Fremtidige filtre
    //----------------------------------

    [
        "koen",
        "region",
        "kommune",
        "civilstand"
    ].forEach(id => {
        const element =
            document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });

    //----------------------------------
    // Ryd søgeresultater
    //----------------------------------

    clearResults();

}
