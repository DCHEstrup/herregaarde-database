import { getSelectedValues } from "./ui/multiselectV2.js";

export function getCurrentFilters() {
    return {
        herregaard:
            getSelectedValues("herregaard"),
        aar:
            getSelectedValues("aar"),
        koen:
            document.getElementById("koen")?.value || null,
        region:
            document.getElementById("region")?.value || null,
        kommune:
            document.getElementById("kommune")?.value || null,
        arbejde:
            document.getElementById("arbejde")?.value.trim() || null,
        civilstand:
            document.getElementById("civilstand")?.value || null
    };
}
