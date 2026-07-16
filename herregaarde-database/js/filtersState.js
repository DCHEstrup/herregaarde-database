import { getSelectedValues } from "./ui/multiselectV2.js";

export function getCurrentFilters() {
    return {
        herregaard:
            getSelectedValues("herregaard"),
        aar:
            getSelectedValues("aar"),
        koen:
            getSelectedValues("koen"),
        trossamfund:
            getSelectedValues("trossamfund"),
        region: 
            getSelectedValues("region"),
        kommune:
            getSelectedValues("kommune"),
        handicap:
            getSelectedValues("handicap"),
        arbejde:
            document.getElementById("arbejde")?.value.trim() || null,
        civilstand:
            getSelectedValues("civilstand")
    };
}
