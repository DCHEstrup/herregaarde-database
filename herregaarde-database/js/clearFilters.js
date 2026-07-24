import { clearMultiSelect } from "./ui/multiselectV2.js";
import { clearResults } from "./ui/results.js";
import { clearSelectedArbejde } from "./ui/arbejdeAutocomplete.js";
import { clearStatistics } from "./ui/statisticsPanel.js";

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
    clearMultiSelect("transportFra");
    clearMultiSelect("transportTil");
    clearMultiSelect("arbejdeSelect");
    const arbejde = document.getElementById("arbejde");
if (arbejde) {
    arbejde.value = "";
}
clearSelectedArbejde();

    //----------------------------------
    // Arbejde / Position
    //----------------------------------

    [
    "arbejde",
    "alderFra",
    "alderTil",
    "transportFra",
    "transportTil",
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
    clearStatistics()
    clearResults();

}
