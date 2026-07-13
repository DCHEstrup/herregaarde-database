import { clearMultiSelect } from "./ui/multiselectV2.js";

export function clearFilters() {

    //----------------------------------
    // Multiselects
    //----------------------------------

    clearMultiSelect("herregaard");
    clearMultiSelect("aar");

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

}
//----------------------------------
// Tøm søgeresultat
//----------------------------------

const content =
    document.getElementById("results");

if (content) {
    content.innerHTML = "";
}
