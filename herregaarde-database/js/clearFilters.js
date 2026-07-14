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

    //----------------------------------
    // Arbejde / Position
    //----------------------------------

    const arbejde =
        document.getElementById("arbejde");
    if (arbejde) {
        arbejde.value = "";
    }

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
