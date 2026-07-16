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
            getSelectedValues("civilstand"),
        alderFra:
    document.getElementById("alderFra")?.value
        ? Number(document.getElementById("alderFra").value)
        : null,

alderTil:
    document.getElementById("alderTil")?.value
        ? Number(document.getElementById("alderTil").value)
        : null,
    };
}
